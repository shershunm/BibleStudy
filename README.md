# Foundational Bible Study

A comprehensive, bilingual (English/Ukrainian) Bible study application with advanced features for sermon preparation, including interactive biblical maps, Strong's dictionary integration, and rich text note-taking.

![Bible Study App](./BibleStudyLogo_darkMode.png)

## Features

### 📖 Bible Reader
- **Bilingual Support**: Switch seamlessly between English (KJV) and Ukrainian (UBIO) translations
- **Side-by-Side Comparison**: Read two translations simultaneously
- **Strong's Numbers**: Integrated Strong's Hebrew and Greek dictionary
- **Verse Notes**: Add personal notes to any verse
- **Customizable**: Adjustable font sizes and dark/light themes

### 🗺️ Biblical Maps (NEW!)
- **20 Biblical Locations**: Major cities, mountains, seas, and regions with detailed descriptions
- **Journey Visualization**: Animated routes for Paul's missionary journeys, the Exodus, and Jesus' ministry
- **Distance Calculator**: Measure distances and calculate "Biblical Walking Days"
- **Bilingual Interface**: All locations and descriptions in English and Ukrainian
- **Export Capabilities**: Export maps as PNG, JPEG, or PDF for sermon presentations
- **Custom Dark Theme**: Black background with Electric Blue (#0033FF) accents

### 📝 Study Tools
- **Rich Text Editor**: Format sermon notes with bold, italic, lists, and more
- **Study Library**: Save and organize multiple sermon notes
- **Search**: Global search across Bible verses, dictionary, maps, and personal notes
- **Snap-to-Note**: Capture map views directly into sermon notes

### 🔍 Advanced Features
- **Strong's Dictionary**: Hebrew and Greek word studies with transliterations
- **Cross-References**: Link locations to related Bible verses
- **Offline Support**: Works without internet (after initial load)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Mapbox GL JS** - Interactive maps
- **React Quill** - Rich text editor
- **CSS Variables** - Theming system

### Backend
- **Node.js** with Express - REST API
- **Prisma ORM** - Database management
- **SQLite** - Local database
- **CORS** - Cross-origin resource sharing

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BibleStudy.git
   cd BibleStudy
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env
   # Edit .env and add your Mapbox token
   ```

4. **Initialize the database**
   ```bash
   cd backend
   npx prisma db push
   node prisma/seed.js
   node prisma/seed-strongs.js
   node prisma/seed-map-data.js
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Open the application**
   - Navigate to `http://localhost:5173`
   - Register a new account or use test credentials:
     - Email: `test@example.com`
     - Password: `password`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Recommended for frontend)
- Netlify
- GitHub Pages
- Traditional servers
- Docker

## Project Structure

```
BibleStudy/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── BibleMapSuite.jsx    # Interactive maps
│   │   │   ├── Reader.jsx           # Bible reader
│   │   │   ├── StudyPanel.jsx       # Notes editor
│   │   │   └── ...
│   │   ├── utils/           # Utility functions
│   │   │   └── mapUtils.js  # Map operations
│   │   ├── assets/          # Static assets
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.js          # Bible data seeder
│   │   ├── seed-strongs.js  # Dictionary seeder
│   │   └── seed-map-data.js # Map data seeder
│   ├── server.js            # Express server
│   └── package.json
│
├── docs/                     # Documentation
├── README.md                 # This file
└── DEPLOYMENT.md             # Deployment guide
```

## Environment Variables

### Frontend (.env)
```bash
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

Get a free Mapbox token at [mapbox.com](https://account.mapbox.com/) (50,000 free map loads/month)

### Backend (.env)
```bash
DATABASE_URL="file:./dev.db"
```

## API Endpoints

### Bible
- `GET /api/bible/versions` - Get all Bible versions
- `GET /api/bible/books/:versionCode` - Get books for a version
- `GET /api/bible/chapter/:versionCode/:bookNumber/:chapterNumber` - Get chapter verses

### Maps
- `GET /api/maps/locations` - Get all biblical locations
- `GET /api/maps/journeys` - Get all journey routes
- `POST /api/maps/snapshots` - Save a map snapshot

### User Data
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/user/:email` - Get user data
- `POST /api/notes` - Save verse notes
- `POST /api/notes/library` - Save sermon notes

### Search
- `GET /api/search?q=query&scope=all` - Global search

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Bible Translations**: KJV (Public Domain), UBIO (Ukrainian Bible)
- **Strong's Dictionary**: Public domain Hebrew and Greek lexicon
- **Maps**: Powered by Mapbox GL JS
- **Icons**: Emoji icons for navigation

## Support

For support, please open an issue on GitHub or contact the maintainers.

## Roadmap

- [ ] Historical overlay for ancient boundaries
- [ ] Offline tile caching for maps
- [ ] Verse-to-map automatic linking
- [ ] Mobile app (React Native)
- [ ] Audio Bible integration
- [ ] Collaborative study groups
- [ ] Cloud sync for notes

---

**Built with ❤️ for Bible study and sermon preparation**
