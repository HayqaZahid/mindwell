# Mindwell — a MERN mental wellbeing app

A full-stack mental health & wellbeing tracker: mood check-ins, journaling, gratitude logs,
CBT-style thought reframing, habit/sleep tracking, guided breathing + grounding exercises,
an AI listening chatbot, an anonymous community board, and a curated resources page.

Built with **MongoDB, Express, React (Vite), Node.js** — plus Tailwind CSS, Recharts, and
the Anthropic API for the chatbot.

## Project structure

```
mindwell/
  backend/     Express API + MongoDB models
  frontend/    React app (Vite + Tailwind)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — a local MongoDB (`mongodb://127.0.0.1:27017/mindwell`) or a free
  MongoDB Atlas connection string (https://www.mongodb.com/cloud/atlas).
- `JWT_SECRET` — any long random string.
- `ANTHROPIC_API_KEY` — from console.anthropic.com, needed for the chatbot page.
  Everything else works fine without it.

Run it:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend at `http://localhost:5000/api`
(see `src/api/axios.js` if you need to change that).

## What's included vs. what's a starting point

**Fully working:** auth (register/login/JWT), mood tracker + 30-day chart, journal, gratitude
log, CBT thought-reframing tool, habit + sleep tracker with chart, breathing exercise (box &
4-7-8) with an animated ring, 5-4-3-2-1 grounding exercise, daily check-in streaks, dark mode,
resources page with real crisis hotlines, and an anonymous community board with support taps
and replies.

**Wired up but needs your API key:** the AI chatbot (`backend/routes/chatbot.js`) calls the
Anthropic API server-side. Add your key to `.env` and it works immediately. The system prompt
is written to keep it supportive and non-clinical, and to redirect anyone in crisis toward real
help — you may want to tune it further.

**Good next steps if you want to extend it:**
- Add basic profanity/keyword moderation in `backend/routes/community.js` (there's a
  `BANNED_WORDS` array ready to fill in).
- Add email verification or password reset to auth.
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify, database to MongoDB Atlas.
- Add push/email reminders for daily check-ins.

## Design notes

The UI uses a custom palette (deep pine green, dusty rose, warm sand background) with Fraunces
for display type and Inter for body text, deliberately avoiding the generic "AI app" cream +
terracotta look. The pulsing ring motif (see `BreathRing.jsx`) is the app's signature element,
used as the logo and, full-size, as the actual breathing exercise.

This is a genuinely sensitive subject area — if you plan to ship this for real users, loop in
someone with mental health / clinical safety expertise before launch, and make sure your crisis
resources are accurate for your actual audience.
