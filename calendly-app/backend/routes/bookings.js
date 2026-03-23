const express = require('express');
const db = require('../db/database');
const { getAvailableSlots } = require('../utils/slotCalculator');

const router = express.Router();

// GET /api/book/:username/:slug?date=YYYY-MM-DD — public
router.get('/:username/:slug', (req, res) => {
  const { username, slug } = req.params;
  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
  }

  const user = db.prepare('SELECT id, username, timezone FROM users WHERE username = ?').get(username.toLowerCase());
  if (!user) return res.status(404).json({ error: 'User not found' });

  const meetingType = db.prepare(
    'SELECT * FROM meeting_types WHERE user_id = ? AND slug = ?'
  ).get(user.id, slug);
  if (!meetingType) return res.status(404).json({ error: 'Meeting type not found' });

  const slots = getAvailableSlots(user.id, meetingType, date);

  res.json({
    meetingType: { title: meetingType.title, duration: meetingType.duration, description: meetingType.description },
    host: { username: user.username, timezone: user.timezone },
    date,
    slots,
  });
});

// POST /api/book/:username/:slug — public
router.post('/:username/:slug', (req, res) => {
  const { username, slug } = req.params;
  const { start_time, guest_name, guest_email } = req.body;

  if (!start_time || !guest_name || !guest_email) {
    return res.status(400).json({ error: 'start_time, guest_name, and guest_email are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const user = db.prepare('SELECT id, username, timezone FROM users WHERE username = ?').get(username.toLowerCase());
  if (!user) return res.status(404).json({ error: 'User not found' });

  const meetingType = db.prepare(
    'SELECT * FROM meeting_types WHERE user_id = ? AND slug = ?'
  ).get(user.id, slug);
  if (!meetingType) return res.status(404).json({ error: 'Meeting type not found' });

  const startMs = new Date(start_time).getTime();
  if (isNaN(startMs)) return res.status(400).json({ error: 'Invalid start_time format' });

  const endMs = startMs + meetingType.duration * 60 * 1000;
  const blockedUntilMs = endMs + meetingType.buffer_time * 60 * 1000;

  const endTime = new Date(endMs).toISOString().slice(0, 19);
  const blockedUntil = new Date(blockedUntilMs).toISOString().slice(0, 19);
  const startNorm = new Date(startMs).toISOString().slice(0, 19);

  const createBooking = db.transaction(() => {
    // Atomic conflict check
    const conflict = db.prepare(`
      SELECT COUNT(*) as count
      FROM bookings b
      INNER JOIN meeting_types mt ON b.meeting_type_id = mt.id
      WHERE mt.user_id = ?
        AND b.status = 'confirmed'
        AND b.start_time < ?
        AND b.end_time > ?
    `).get(user.id, blockedUntil, startNorm);

    if (conflict.count > 0) {
      return { error: 'Slot no longer available' };
    }

    // Verify slot is in computed available list
    const dateString = startNorm.slice(0, 10);
    const availableSlots = getAvailableSlots(user.id, meetingType, dateString);
    const isValid = availableSlots.some(s => s.start === startNorm);

    if (!isValid) {
      return { error: 'Slot no longer available' };
    }

    const result = db.prepare(`
      INSERT INTO bookings (meeting_type_id, guest_name, guest_email, start_time, end_time)
      VALUES (?, ?, ?, ?, ?)
    `).run(meetingType.id, guest_name, guest_email, startNorm, blockedUntil);

    return { bookingId: result.lastInsertRowid };
  });

  const outcome = createBooking();
  if (outcome.error) {
    return res.status(409).json({ error: outcome.error });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(outcome.bookingId);
  res.status(201).json({
    booking: {
      id: booking.id,
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      start_time: startNorm,
      end_time: endTime,
      status: booking.status,
      meetingType: { title: meetingType.title, duration: meetingType.duration },
      host: { username: user.username, timezone: user.timezone },
    },
  });
});

module.exports = router;
