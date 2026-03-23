const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings — host's upcoming bookings
router.get('/', requireAuth, (req, res) => {
  const { status = 'confirmed', from } = req.query;
  const fromDate = from || new Date().toISOString().slice(0, 10);

  const bookings = db.prepare(`
    SELECT b.*, mt.title as meeting_title, mt.duration, mt.slug
    FROM bookings b
    INNER JOIN meeting_types mt ON b.meeting_type_id = mt.id
    WHERE mt.user_id = ?
      AND b.status = ?
      AND b.start_time >= ?
    ORDER BY b.start_time ASC
  `).all(req.user.id, status, fromDate + 'T00:00:00');

  res.json(bookings.map(b => ({
    id: b.id,
    guest_name: b.guest_name,
    guest_email: b.guest_email,
    start_time: b.start_time,
    end_time: b.end_time,
    status: b.status,
    created_at: b.created_at,
    meetingType: { title: b.meeting_title, duration: b.duration, slug: b.slug },
  })));
});

module.exports = router;
