# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projects

- **Schedulr** (`calendly-app/`) — Full-stack Calendly-like meeting scheduling MVP
- **Jump Runner** (`game.html`) — Standalone HTML5 Canvas browser game (single file)

## Development Commands

### Schedulr Frontend (`calendly-app/frontend/`)
```bash
npm run dev      # Dev server at http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint
```

### Schedulr Backend (`calendly-app/backend/`)
```bash
npm start        # Run server at http://localhost:3001
npm run dev      # Run with --watch (auto-restart)
```

Both servers must run simultaneously. The frontend Vite dev server proxies `/api/*` to `http://localhost:3001`.

Backend requires a `.env` file — copy from `.env.example`.

## Architecture

### Frontend
React 19 + React Router 7 + Tailwind CSS 4, built with Vite.

- `src/context/AuthContext.jsx` — Global auth state (JWT stored in localStorage)
- `src/pages/` — Route-level components
- `src/components/host/` — Authenticated host views (meeting types, availability, bookings)
- `src/components/booking/` — Public guest booking flow (calendar → time slot → form → confirmation)
- `src/components/layout/` — Navbar, ProtectedRoute wrapper

Route structure: public routes at `/`, `/login`, `/register`, `/:username/:slug` (guest booking); protected routes under `/dashboard/*`.

### Backend
Express + SQLite (`better-sqlite3`), JWT auth (7-day expiry), bcryptjs for passwords.

- `server.js` — App setup and route registration
- `db/database.js` — SQLite connection and schema initialization (auto-runs on startup)
- `db/schema.sql` — 4 tables: `users`, `meeting_types`, `availability`, `bookings`
- `utils/slotCalculator.js` — Core scheduling algorithm: computes available time slots from user availability rules and existing bookings
- `middleware/auth.js` — JWT verification middleware

API routes: `/api/auth`, `/api/users`, `/api/meeting-types`, `/api/availability`, `/api/book` (public), `/api/bookings`.

### Database
SQLite file (`calendly.db`) created automatically on first run. Schema is initialized from `db/schema.sql` via `db/database.js`.
