# URL Shortener

A modern URL shortening service built with Node.js and Express.

![URL Shortener](https://i.ibb.co/svf72rq/URL-Shortener-488cba09-76df-47e3-a400-4cf3d0a0f257-1.png)

## Features

- 🔗 Quick URL shortening
- 🎯 Custom aliases
- 🔒 Password protection
- ⏰ Expiration dates
- 📱 QR code generation
- 👀 URL preview

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Frontend**: EJS, Bootstrap 5
- **Icons**: Font Awesome
- **Notifications**: SweetAlert2

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies using npm install
3. Copy .env.example to .env and update the values
4. Start the server using npm start
5. For development, use npm run dev

## Project Structure

📁 url-shortener/
├── 📁 public/           # Static assets
│   ├── css/
│   └── js/
├── 📁 views/           # EJS templates
├── app.js             # Main application
├── .env               # Configuration
└── package.json       # Dependencies

## API Usage

### Create Short URL

POST /shorten

Request body:
{
  "url": "https://example.com/long-url",
  "customSlug": "custom-name",     // optional
  "password": "secretpass",        // optional
  "expiresIn": "7:days"           // optional
}

### Access Short URL

GET /{shortId}
GET /{shortId}?preview=true    // Preview mode
GET /{shortId}?password=pass   // Protected URLs

## Environment Variables

PORT=1986
BASE_URL=https://srl.ink

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Kha Dang - [@khadnhdev](https://www.linkedin.com/in/khadnh/)


---
Made with ❤️ by [Kha Dang]