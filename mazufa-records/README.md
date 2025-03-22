# Mazufa Records - Music Distribution Platform

A modern web platform for artists to distribute their music across major streaming platforms.

## Features

- Music distribution to major platforms (Spotify, Apple Music, Amazon, etc.)
- Advanced analytics and performance tracking
- Secure content protection
- User-friendly dashboard
- Dark/light mode support
- Responsive design

## Tech Stack

### Frontend
- HTML5
- Tailwind CSS for styling
- JavaScript (ES6+)
- Three.js for 3D effects
- Chart.js for analytics
- Font Awesome icons
- Google Fonts

### Backend
- Python 3.10+
- Flask web framework
- SQLAlchemy ORM
- JWT for authentication
- RESTful API architecture

## Prerequisites

- Python 3.10 or higher
- Node.js 16.0 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mazufa-records.git
cd mazufa-records
```

2. Install Python dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Build the CSS:
```bash
npm run build:css
```

## Development

1. Start the Python server:
```bash
python server.py
```

2. Watch for CSS changes:
```bash
npm run watch:css
```

The application will be available at `http://localhost:8000`

## Production Deployment

1. Build the production CSS:
```bash
npm run build:css
```

2. Start the production server:
```bash
gunicorn -w 4 server:app
```

## Testing

Run the test suite:
```bash
pytest
```

Run JavaScript tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@mazufarecords.com or join our Slack channel.