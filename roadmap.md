# 🚀 AI Virtual Health Assistant for Refugees — Hackathon MVP Roadmap

> **Timebox:** 10–12 Hours  
> **Goal:** Build a voice-enabled, map-connected, refugee-centered virtual health assistant with unique UX features like “Draw Your Pain” and “Safe Route Navigation”.

---

## 🧭 PROJECT OVERVIEW

### 🎯 Core Mission
- **Voice-first, multilingual health assistant** for refugees
- **Symptom triage** (rule-based, voice input)
- **Mental health audio support**
- **Clinic map with safe route navigation**
- **Offline-first first aid guides**
- **Printable/SMS-able summaries**
- **Database-backed content** (clinics, guides, stories, summaries)

### 🌟 Unique Selling Points (USPs)
1. “Draw Your Pain” — touch body zones for symptom mapping
2. “I’m Not Alone” — audio stories in multiple languages
3. “Safe Route” — navigation avoiding unsafe zones
4. Printable triage summary
5. Offline-first first aid with voice narration
6. Scalable Firestore DB for all content

---

## 🏗️ TECHNICAL ARCHITECTURE

```
[User Browser]
│
▼
[React Frontend (Vite)] ←── Web Speech API (Voice Input)
│ │
│ ▼
│ [Symptom Mapper (JS Object)]
│ │
│ ▼
│ [Rule-Based Triage Engine]
│ │
│ ▼
│ [Advice + Printable Summary]
│
├──→ [Leaflet.js Map] ←── Geolocation API
│ │
│ ▼
│ [Firebase Firestore: Clinics + Unsafe Zones]
│ │
│ ▼
│ [“Safe Route” Toggle]
│
├──→ [Mental Health Module]
│ │
│ ├── Mood Selector
│ ├── Audio Stories (from DB)
│ └── Breathing Exercise GIF
│
└──→ [First Aid Module]
    ├── Guides (from DB)
    ├── Voice Narration
    └── Downloadable PDF
```

> **Backend:** Firebase Firestore (or Supabase/JSON fallback)

---

## 🧰 TECH STACK

| Component         | Tech Choice              |
|-------------------|--------------------------|
| Frontend          | React + Vite             |
| Routing           | React Router DOM         |
| Maps              | Leaflet.js               |
| Voice Input       | Web Speech API           |
| Voice Output      | ElevenLabs/MP3           |
| Database          | Firebase Firestore       |
| UI/UX             | Tailwind CSS             |
| Hosting           | Vercel                   |
| Fallbacks         | Static JSON, localStorage|

---

## 📂 DATABASE SCHEMA (EXAMPLES)

### Clinics
```json
{
  "name": "Hope Medical Tent",
  "lat": 39.9,
  "lng": 32.8,
  "services": ["General", "Mental Health"],
  "unsafeZones": [{ "lat": 39.91, "lng": 32.81 }]
}
```
### FirstAidGuides
```json
{
  "topic": "Bleeding",
  "steps": ["Apply pressure", "Elevate wound", "Seek medical help"],
  "imageUrl": "bleeding.png",
  "audioUrl": "bleeding.mp3"
}
```
### Stories
```json
{
  "language": "Arabic",
  "title": "I survived displacement",
  "audioUrl": "story1.mp3"
}
```
### UserTriageSummaries
```json
{
  "userId": "anon123",
  "symptoms": ["fever", "cough"],
  "urgency": "high",
  "advice": "Seek clinic within 24h",
  "createdAt": "2025-09-18T10:00:00Z"
}
```

---

## ⏱️ 12-HOUR DEVELOPMENT ROADMAP (TEAM OF 2–3)


### HOUR 0–1: SETUP & WIREFRAME
- Sujay: Scaffold React + Vite project, set up repo, CI, Vercel deploy
- Mehul: Setup Firebase project, Firestore rules, seed sample data
- Nidhi: Tailwind config, base layout, navigation, color scheme
- Nithin: Create `/voice` module, add Web Speech API polyfill if needed
- All: Sketch 4 screens (Home, Triage, Map, First Aid/Mental Health)


### HOUR 1–3: VOICE INPUT & TRIAGE ENGINE
- Nithin: Implement Web Speech API (multi-language), keyword detection
- Nithin: Build symptom keyword map, rule-based triage logic
- Nithin: "Draw Your Pain" canvas overlay (body zones → symptoms)
- Nithin: Save triage results to Firestore, printable summary
- Sujay: Define shared types/interfaces for triage data
- Nidhi: Design Triage UI, integrate voice input, add print/download button


### HOUR 3–5: LOCATION & CLINIC MAP
- Mehul: Fetch clinics/unsafe zones from Firestore, provide mock data fallback
- Mehul: Implement React-Leaflet map, geolocation, clinic markers
- Mehul: Add "Safe Route" toggle, overlay unsafe zones
- Sujay: Integrate map with triage results (e.g., show nearest clinic after triage)
- Nidhi: Style map UI, add location permission prompt, mobile responsiveness


### HOUR 5–7: MENTAL HEALTH & FIRST AID MODULES
- Nidhi: Fetch stories/guides from Firestore, display with images/audio
- Nidhi: Implement mood selector, match stories/resources
- Nidhi: Add "Play Instructions" (SpeechSynthesisUtterance), download PDF (jsPDF)
- Mehul: Ensure DB structure supports multi-language content
- Sujay: Integrate modules, ensure navigation between triage/map/first aid/mental health


### HOUR 7–9: USP & UI POLISH
- Nithin: Finalize "Draw Your Pain" UI, test on mobile
- Nidhi: Add language toggle (EN/AR/UKR), SDG icons, accessibility features
- Nidhi: Responsive design (Tailwind breakpoints), offline fallback (localStorage)
- Sujay: Review integration, fix merge issues, update shared types


### HOUR 9–11: TESTING & DEMO PREP
- Sujay: Test DB read/write (clinics, triage), run integration tests
- All: Test on Chrome Mobile (voice, map, DB sync)
- Nidhi: Add /about page (team, SDGs), polish UI
- Mehul: Cache DB results locally (PWA manifest), test offline mode
- Sujay: Record demo video, coordinate demo script


### HOUR 11–12: DEPLOY & PITCH
- Sujay: Deploy to Vercel with Firebase config, final QA
- All: Prepare 2-min pitch (Problem, USP Demo, Tech, Call to Action)
- Nidhi: Add “Try Demo” button on homepage, final UI polish

---

## 👥 TEAM TASK DELEGATION (4 MEMBERS)

| Member  | Role/Area         | Key Tasks |
|---------|-------------------|----------|
| Sujay   | Project Lead & Integration | 
|         | - Set up repo, Vercel deploy, CI/CD, code review
|         | - Integrate all modules, resolve merge conflicts
|         | - Maintain shared types/interfaces, env config
|         | - Final QA, demo video, pitch deck
| Nithin  | Voice/AI & Triage | 
|         | - Implement Web Speech API (multi-language)
|         | - Build symptom keyword map, rule-based triage engine
|         | - "Draw Your Pain" canvas overlay (body zones → symptoms)
|         | - Save triage results to Firestore, printable summary
| Mehul   | Map & Data        |
|         | - Firestore setup: clinics, unsafe zones, stories, guides
|         | - React-Leaflet map, geolocation, clinic markers
|         | - "Safe Route" toggle, overlay unsafe zones
|         | - Fallback to static JSON/localStorage
| Nidhi   | UI/UX & Content   |
|         | - Tailwind setup, responsive layout, navigation
|         | - Mental Health & First Aid modules (fetch/display from DB)
|         | - Audio stories, mood selector, first aid guides (images/audio)
|         | - Language toggle, SDG icons, offline/PWA, accessibility

**Integration Plan:**
- Use shared types/interfaces for DB models (in `/types` or `/models`)
- Each member works in a feature folder (`/voice`, `/map`, `/ui`, `/data`)
- Sujay merges PRs, resolves conflicts, and ensures smooth integration
- Use mock data for initial dev, then connect to Firestore
- Regular short syncs to align on API/data contracts

---

## 🚨 FALLBACKS / PLAN B
- **Firebase DB** → Fallback to local JSON
- **Voice Input** → Text input box
- **Geolocation** → Enter City field
- **Audio Stories** → Text testimonials
- **Clinic Directions** → Show address only
- **Language Detection** → Manual dropdown

---


## ✅ FINAL DELIVERABLES
- Live Web App URL (Vercel)
- 60-Second Demo Video (with voice, map, triage, first aid, and offline demo)
- Pitch Deck (3 slides: Problem, Solution/USPs, Demo/Impact)
- GitHub Repo with clean commits, README, and `/docs` folder
- This roadmap.md as proof of planning
- Sample DB export (clinics, guides, stories)
- Screenshots of all key features

---


## 💡 FINAL TIPS
- Focus on USPs: Draw Your Pain, Safe Route, Offline-First, Multilingual
- Use shared types/interfaces for all DB models
- Test on mobile early and often
- Use offline fallback for all DB content
- Keep PRs small and focused, review frequently
- Update checkboxes [ ] → [x] as you complete tasks
- Communicate blockers early, sync on integration points

---

> “We didn’t just build a symptom checker — we built a voice-first, trauma-informed, database-powered, offline-ready companion for refugees. Our ‘Draw Your Pain’, ‘Safe Route’, and scalable Firestore features show we designed with empathy — not just code.”

---

**You’ve got this — go build something meaningful!**
