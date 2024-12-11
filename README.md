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

## API Usage

### Create Short URL

POST /shorten

**Request Body:**
```json
{
  "url": "https://example.com/long-url",
  "customSlug": "custom-name",      // Optional
  "password": "secretpass",         // Optional
  "expiresIn": "7:days"            // Optional
}
```

**Response:**
```json
{
  "shortUrl": "https://srl.ink/abc123",
  "qrCode": "data:image/png;base64,..."
}
```

### Access Short URL

**Base URL:**
```
GET /{shortId}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `preview` | `boolean` | Show preview page instead of direct redirect |
| `password` | `string` | Required for password-protected URLs |

**Examples:**
```
GET /abc123              # Direct redirect
GET /abc123?preview=true # Show preview page
GET /abc123?password=123 # Access protected URL
```

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