# STUDYVERSE — Full-Stack AI Academic Study Platform

> **"Train Your Mind. Complete Your Mission."**

StudyVerse is a full-stack, AI-powered academic learning ecosystem that transforms study workflows into superhero training missions. Powered by **S.A.T.U.R.D.A.Y.** (*Student Assistant To Understand, Review, & Deliver Academic Yield*), the platform communicates exclusively through a secure Node.js/Express backend with Google Gemini (`@google/genai` SDK) to deliver personalized study notes, interactive quizzes, multi-turn AI tutoring, and adaptive training roadmaps.

---

## 🏛 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   React 19 + Vite Frontend                  │
│  - Knowledge Lab (Deep Topic Synthesis & Study Notes)       │
│  - Battle Arena (Gamified Topic Quizzes & Boss Combats)      │
│  - S.A.T.U.R.D.A.Y. (Multi-Turn Conversational Tutor)       │
│  - Mission Planner & Mission Control (Adaptive Roadmaps)    │
│  - Knowledge Vault (User Note Storage & Revision)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (Bearer JWT Auth)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Node.js / Express Backend                 │
│  - JWT Authentication & Bcrypt Passcode Hashing             │
│  - Per-User Strict Data Isolation                           │
│  - Rate Limiting (Sliding Window on AI Routes)              │
│  - In-Flight Request Deduplication & Retry Backoff          │
│  - Robust JSON Schema Parsing & Sanitization               │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│       Database Layer        │ │       LLM Service           │
│  - MongoDB Atlas (Production│ │  - Google Gemini AI via     │
│    remote cluster)          │ │    official @google/genai   │
│  - Zero-Setup MongoMemory   │ │  - Structured JSON Schemas  │
│    for offline dev fallback │ │  - Multi-Turn Context Array │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## ✨ Features

- **S.A.T.U.R.D.A.Y. AI Companion**: Real-time multi-turn conversational chat with conversation history switching and topic preservation.
- **Knowledge Lab**: In-depth academic topic synthesizer generating structured dossiers with core concepts, mechanisms, practical examples, and exam traps across difficulty tiers (Beginner, Intermediate, Advanced, Master).
- **Battle Arena**: Dynamic multiple-choice quiz generator for any subject with randomized options, validated answer keys, explanations, and XP reward scaling.
- **Mission Planner & Today's Mission**: Personalized multi-day study roadmaps that adapt based on topic, goal, daily study hours, duration, and past quiz performance history.
- **Knowledge Vault**: Persistent storage and organization for saved study notes with quick search and removal.
- **Hero Persona & Gamification**: Level progression, XP multipliers, combat streaks, and class specializations (Tech Titan, Knowledge Warrior, Cyber Ninja, Strategist, Guardian).

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Router v7, Axios
- **Backend**: Node.js, Express (ESM), Mongoose, JSON Web Tokens (JWT), Bcrypt, CORS
- **AI / LLM**: Google Gemini API via official `@google/genai` SDK (`gemini-3.5-flash-lite` / `GEMINI_MODEL`)
- **Database**: MongoDB Atlas (production) / `mongodb-memory-server` (zero-config local dev)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0+ or v20.0+ installed
- **npm**: v9.0+
- **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Installation
Install frontend and backend dependencies:
```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```
Populate `backend/.env` with your settings:
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=your_secure_development_jwt_secret_here
CLIENT_URL=http://localhost:5173
SEED_DEMO=true
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

**Frontend (`.env` - Optional for local dev):**
```env
VITE_API_BASE_URL=/api
```
*(The Vite dev server automatically proxies `/api` requests to `http://localhost:5000`)*

### 4. Running the App Locally

**Option A — Two Terminals (Recommended):**
```bash
# Terminal 1: Start Backend Server
npm run server:dev

# Terminal 2: Start Frontend Dev Server
npm run dev
```

**Option B — Run Backend Test Suite:**
```bash
cd backend && npm test
```

Access the frontend in your browser at `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

| Variable | Location | Description | Required in Production |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port number Express listens on (e.g. `5000` or assigned by host). | Automatic on Render/Railway |
| `MONGODB_URI` | Backend | Connection string for MongoDB Atlas database. | Yes |
| `JWT_SECRET` | Backend | Cryptographic secret for signing and verifying authentication tokens. | Yes |
| `CLIENT_URL` | Backend | Comma-separated list of allowed frontend origins for CORS. | Yes |
| `SEED_DEMO` | Backend | Set to `true` to seed sample demo accounts on startup; `false` to disable. | Optional (`false` for clean prod) |
| `GEMINI_API_KEY` | Backend | Google Gemini API key obtained from Google AI Studio. | Yes |
| `GEMINI_MODEL` | Backend | Gemini model identifier (e.g. `gemini-3.5-flash-lite`). | Optional (defaults to `gemini-3.5-flash-lite`) |
| `VITE_API_BASE_URL` | Frontend | Full backend API URL (e.g. `https://your-backend.onrender.com/api`). | Yes (on Vercel/Netlify) |

---

## 📡 API Endpoints

### System Diagnostics
- `GET /api/health` — Returns server health, MongoDB connection status, and LLM configuration state without exposing secrets.

### Authentication & Profile
- `POST /api/auth/register` — Register a new superhero candidate.
- `POST /api/auth/login` — Authenticate superhero credentials and issue JWT.
- `GET /api/profile` — Fetch authenticated user profile and stats (*Protected*).
- `PUT /api/profile` — Update user level, XP, and stats (*Protected*).

### S.A.T.U.R.D.A.Y. AI Chat & Explanations
- `POST /api/saturday/chat` — Send a message to S.A.T.U.R.D.A.Y. with conversation context (*Protected*).
- `GET /api/saturday/conversations` — List conversation threads for current user (*Protected*).
- `GET /api/saturday/conversations/:id` — Retrieve messages of a specific thread (*Protected*).
- `POST /api/explain` — Synthesize deep topic explanation dossier (*Protected*).

### Battle Arena (Quizzes)
- `POST /api/quiz/generate` — Dynamically generate topic-specific MCQs with answer index and explanations (*Protected*).
- `POST /api/quiz/submit` — Submit quiz score and update user accuracy statistics (*Protected*).
- `GET /api/quiz/history` — Get recent quiz attempts and performance (*Protected*).

### Knowledge Vault (Notes)
- `GET /api/notes` — Retrieve current user's saved notes (*Protected*).
- `POST /api/notes` — Save a study note to the vault (*Protected*).
- `DELETE /api/notes/:id` — Delete a note belonging to the user (*Protected*).

### Mission Planner & Today's Mission
- `POST /api/missions/generate` — Generate multi-day study roadmap utilizing real quiz performance history (*Protected*).
- `GET /api/missions/plans` — Fetch latest generated study plan (*Protected*).
- `GET /api/missions` — Get user mission to-dos (*Protected*).
- `POST /api/missions` — Add a mission to-do (*Protected*).
- `DELETE /api/missions/:id` — Remove a mission to-do (*Protected*).
- `GET /api/missions/daily` — Get today's active mission (*Protected*).
- `PUT /api/missions/daily` — Update today's mission (*Protected*).
- `DELETE /api/missions/daily` — Clear today's mission (*Protected*).

---

## 👤 Pre-Seeded Demo Credentials

If `SEED_DEMO=true` is enabled, the following demo accounts are available on the login page:

| Superhero Codename | Character Class | Level | Passcode |
| :--- | :--- | :--- | :--- |
| **NovaByte** | Tech Titan | Level 9 | `demo1234` |
| **QuantumQuill** | Knowledge Warrior | Level 6 | `demo1234` |
| **CipherSage** | Strategist | Level 3 | `demo1234` |

*New hero candidates can also register fresh accounts with custom codenames and avatars.*

---

## 🌐 Deployment Guide

### Step 1: Deploy Database on MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
3. Under **Database Access**, create a database user and password.
4. Click **Connect** → **Drivers** and copy the connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/studyverse?retryWrites=true&w=majority`).

### Step 2: Deploy Backend on Render
1. Create a new **Web Service** on [render.com](https://render.com) connected to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Under **Environment Variables**, configure:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<A strong random 32+ character secret string>`
   - `GEMINI_API_KEY`: `<Your Google Gemini API key>`
   - `GEMINI_MODEL`: `gemini-3.5-flash-lite`
   - `SEED_DEMO`: `true` (or `false`)
   - `CLIENT_URL`: `https://your-studyverse-frontend.vercel.app`
6. Deploy the web service and copy the deployed URL (e.g., `https://studyverse-backend.onrender.com`).

### Step 3: Deploy Frontend on Vercel
1. Import your repository on [vercel.com](https://vercel.com).
2. Set **Framework Preset** to `Vite`.
3. Set **Root Directory** to `./` (root).
4. Under **Environment Variables**, configure:
   - `VITE_API_BASE_URL`: `https://studyverse-backend.onrender.com/api`
5. Click **Deploy**.
6. Once deployed, verify your Vercel URL matches the `CLIENT_URL` set in Render environment variables.

---

## ⚠️ Known Limitations & Notes

1. **Free-Tier Gemini API Quotas**: Google Gemini free-tier keys have rate limits (RPM/RPD). The backend includes automatic retry backoff and a per-client sliding window rate limiter, but high concurrent requests may experience short pauses.
2. **First-Load Cold Starts on Render**: Free Render backend instances sleep after inactivity and may take 30–50 seconds to wake up on the first request.
3. **Bonus Features**: File attachment upload and document parsing features are reserved for future major release milestones.
