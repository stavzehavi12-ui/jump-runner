# Schedulr — Calendly-like Meeting Scheduler

A full-stack meeting scheduling MVP built with React + Node.js + SQLite.

## Quick Start

You need two terminals.

### Terminal 1 — Backend

```bash
cd calendly-app/backend
npm install        # already done
node server.js     # runs on http://localhost:3001
```

### Terminal 2 — Frontend

```bash
cd calendly-app/frontend
npm install        # already done
npm run dev        # runs on http://localhost:5173
```

Open http://localhost:5173

---

## Demo Flow

1. **Register** at `/register` (pick a username like `alice`)
2. **Set availability** at `/dashboard/availability` (toggle Mon-Fri, set hours)
3. **Create a meeting type** at `/dashboard/new-meeting` (e.g. "30 Minute Call", 30 min)
4. **Copy the booking link** from your dashboard — it looks like `/alice/30-minute-call`
5. **Open the link in an incognito window** — this is the guest view
6. Pick a date → pick a time → enter your name/email → confirm

---

## Project Structure

```
calendly-app/
├── backend/
│   ├── server.js              # Express entry point
│   ├── db/
│   │   ├── database.js        # SQLite connection + schema init
│   │   └── schema.sql         # 4 tables: users, meeting_types, availability, bookings
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/register|login
│   │   ├── meetingTypes.js    # CRUD /api/meeting-types
│   │   ├── availability.js    # GET/PUT /api/availability
│   │   ├── bookings.js        # Public booking: GET|POST /api/book/:user/:slug
│   │   └── hostBookings.js    # Host's bookings: GET /api/bookings
│   └── utils/
│       └── slotCalculator.js  # Core scheduling algorithm
└── frontend/
    └── src/
        ├── context/AuthContext.jsx    # Auth state + localStorage
        ├── pages/                     # Login, Register, Dashboard, BookingPage, etc.
        └── components/
            ├── host/      # MeetingTypeCard, AvailabilityGrid, BookingsList
            └── booking/   # CalendarPicker, TimeSlotPicker, BookingForm, ConfirmationScreen
```

---

## Production Scaling

| Concern | MVP | Production |
|---------|-----|------------|
| Database | SQLite (file) | PostgreSQL + connection pool |
| Auth | JWT 7d expiry | JWT refresh tokens + rotation |
| Caching | None | Redis for slot availability |
| Email | None | SendGrid/Resend confirmation emails |
| Calendar sync | None | Google Calendar / Outlook OAuth |
| Rate limiting | None | express-rate-limit on booking endpoints |
| Deploy | Local | Backend: Railway/Render, Frontend: Vercel |
| Timezone | Stored, displayed | Full tz-aware slot generation with date-fns-tz |
