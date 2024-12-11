const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const shortid = require('shortid');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const device = require('express-device');
const geoip = require('geoip-lite');
const moment = require('moment');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(device.capture());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('urls.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to database');
  
  // Create tables if they don't exist
  db.run(`CREATE TABLE IF NOT EXISTS urls (
    id TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    password TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0,
    geo_rules TEXT,
    device_rules TEXT
  )`);
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Create short URL
app.post('/shorten', async (req, res) => {
  const {
    url,
    customSlug,
    password,
    expiresIn,
    geoRules,
    deviceRules
  } = req.body;

  let urlId = customSlug || shortid.generate();
  
  // Check if custom slug is available
  if (customSlug) {
    const existing = await new Promise((resolve) => {
      db.get('SELECT id FROM urls WHERE id = ?', [customSlug], (err, row) => {
        resolve(row);
      });
    });
    
    if (existing) {
      return res.json({ error: 'Custom slug already taken' });
    }
  }

  // Calculate expiration date
  let expiresAt = null;
  if (expiresIn) {
    expiresAt = moment().add(
      parseInt(expiresIn.split(':')[0]),
      expiresIn.split(':')[1]
    ).format('YYYY-MM-DD HH:mm:ss');
  }

  // Hash password if provided
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  db.run(
    `INSERT INTO urls (id, original_url, password, expires_at, geo_rules, device_rules)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [urlId, url, hashedPassword, expiresAt, JSON.stringify(geoRules), JSON.stringify(deviceRules)],
    async (err) => {
      if (err) return res.json({ error: err.message });

      // Generate QR Code
      const qrCode = await QRCode.toDataURL(`${process.env.BASE_URL}/${urlId}`);
      
      res.json({
        shortUrl: `${process.env.BASE_URL}/${urlId}`,
        qrCode
      });
    }
  );
});

// Handle redirect
app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.query;

  db.get('SELECT * FROM urls WHERE id = ?', [id], async (err, url) => {
    if (err) {
      console.error('Database error:', err);
      return res.render('error', { 
        message: 'An error occurred while retrieving the URL.' 
      });
    }
    
    if (!url) {
      return res.render('error', { 
        message: 'The requested short URL was not found or has been removed.' 
      });
    }

    // Check expiration
    if (url.expires_at && moment().isAfter(moment(url.expires_at))) {
      return res.render('error', { 
        message: 'This link has expired. Please contact the creator for a new link.' 
      });
    }

    // Check password
    if (url.password) {
      if (!password) {
        return res.render('password', { id });
      }
      
      const validPassword = await bcrypt.compare(password, url.password);
      if (!validPassword) {
        return res.render('password', { id, error: 'Invalid password' });
      }
    }

    // Check geo rules
    if (url.geo_rules) {
      const geoRules = JSON.parse(url.geo_rules);
      const ip = req.ip;
      const geo = geoip.lookup(ip);
      
      if (geo && geoRules[geo.country]) {
        return res.redirect(geoRules[geo.country]);
      }
    }

    // Check device rules
    if (url.device_rules) {
      const deviceRules = JSON.parse(url.device_rules);
      const userDevice = req.device.type;
      
      if (deviceRules[userDevice]) {
        return res.redirect(deviceRules[userDevice]);
      }
    }

    // Increment clicks
    db.run('UPDATE urls SET clicks = clicks + 1 WHERE id = ?', [id]);

    // Preview option
    if (req.query.preview === 'true') {
      return res.render('preview', { url: url.original_url });
    }

    res.redirect(url.original_url);
  });
});

// Error handler for 404
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'The page you are looking for does not exist.'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  res.status(500).render('error', {
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});