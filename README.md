# 🚀 AI Virtual Health Assistant for Refugees

> A voice-enabled, multilingual health assistant built specifically for refugees, featuring innovative UX like "Draw Your Pain" and "Safe Route Navigation".

## 🌟 Features

- **Voice-first health assessment** with multilingual support
- **Interactive body mapping** ("Draw Your Pain") for symptom visualization
- **Safe route navigation** avoiding unsafe zones
- **Offline-ready first aid guides** with voice narration
- **Mental health support** with audio stories and breathing exercises
- **Printable triage summaries** for medical visits
- **PWA support** for mobile devices

## 🏗️ Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js + React-Leaflet
- **Voice**: Web Speech API
- **Database**: Firebase Firestore (with local fallback)
- **Deployment**: Vercel
- **PWA**: Vite-Plugin-PWA

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project (optional - works with mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/SujayAgarwal28/Hackphasia.git
cd Hackphasia

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Firebase configuration (optional)
# The app works with mock data if Firebase is not configured

# Start development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Firebase Configuration (optional - fallback to mock data)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Map Configuration (defaults to Ankara, Turkey)
VITE_DEFAULT_MAP_CENTER_LAT=39.9334
VITE_DEFAULT_MAP_CENTER_LNG=32.8597
VITE_DEFAULT_MAP_ZOOM=10

# Feature Flags
VITE_ENABLE_VOICE_INPUT=true
VITE_ENABLE_SAFE_ROUTE=true
VITE_ENABLE_PWA=true
```

## 📁 Project Structure

```
src/
├── components/          # Shared UI components
├── pages/              # Main application pages
├── voice/              # Voice recognition & triage logic
├── map/                # Map & geolocation features  
├── ui/                 # UI/UX components & styling
├── data/               # Database & mock data services
├── types/              # TypeScript type definitions
├── config/             # App configuration & env handling
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── assets/             # Images, icons, audio files
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy to Vercel
   vercel
   ```

2. **Configure Environment Variables** in Vercel dashboard:
   - Go to your project settings
   - Add all environment variables from `.env.example`
   - Configure Firebase credentials for production

3. **Automatic Deployments**:
   - Push to `main` branch triggers production deployment
   - Pull requests create preview deployments

### Manual Build

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Upload dist/ contents to any static hosting service
```

## 🏥 Key Features Implementation

### Voice-Enabled Health Assessment
- Web Speech API integration with multilingual support
- Keyword detection and symptom mapping
- Rule-based triage engine for urgency classification

### "Draw Your Pain" Feature
- Interactive body zone mapping using HTML5 Canvas
- Touch/click interface for symptom visualization
- Integration with triage recommendations

### Safe Route Navigation
- Leaflet.js maps with clinic markers
- Unsafe zone overlay and avoidance algorithms
- Real-time geolocation and route calculation

### Offline-First Architecture
- Service Worker for offline functionality
- Local data caching and synchronization
- Mock data fallbacks when Firebase unavailable

### Mental Health Support
- Curated audio stories in multiple languages
- Guided breathing exercises with visual aids
- Mood tracking and resource recommendations

## 🌍 Supported Languages

- English (en)
- Arabic (ar)
- Ukrainian (uk)
- Spanish (es)
- French (fr)

## 🎯 SDG Alignment

This project supports UN Sustainable Development Goals:

- **SDG 3**: Good Health and Well-being
- **SDG 10**: Reduced Inequalities  
- **SDG 16**: Peace, Justice and Strong Institutions

## 👥 Team

- **Sujay Agarwal** - Project Lead & Integration
- **Nithin** - Voice/AI & Triage Engine
- **Mehul** - Maps & Data Management
- **Nidhi** - UI/UX & Content

## 📄 License

MIT License - Built for Hackphasia 2025

## 🚨 Emergency Disclaimer

This application is designed for informational purposes and basic health guidance. It is NOT a replacement for professional medical care. In emergency situations, always contact local emergency services immediately.

---

**"We didn't just build a symptom checker — we built a voice-first, trauma-informed, database-powered, offline-ready companion for refugees."**