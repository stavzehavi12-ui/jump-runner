const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const slots = db.prepare(
    'SELECT day_of_week, start_time, end_time FROM availability WHERE user_id = ? ORDER BY day_of_week'
  ).all(req.user.id);
  res.json(slots);
});

router.put('/', requireAuth, (req, res) => {
  const slots = req.body;

  if (!Array.isArray(slots)) {
    return res.status(400).json({ error: 'Body must be an array of availability slots' });
  }

  for (const slot of slots) {
    if (slot.day_of_week < 0 || slot.day_of_week > 6) {
      return res.status(400).json({ error: 'day_of_week must be 0-6' });
    }
    if (!slot.start_time || !slot.end_time) {
      return res.status(400).json({ error: 'start_time and end_time required' });
    }
    if (slot.start_time >= slot.end_time) {
      return res.status(400).json({ error: 'start_time must be before end_time' });
    }
  }

  const replace = db.transaction(() => {
    db.prepare('DELETE FROM availability WHERE user_id = ?').run(req.user.id);
    const insert = db.prepare(
      'INSERT INTO availability (user_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)'
    );
    for (const slot of slots) {
      insert.run(req.user.id, Number(slot.day_of_week), slot.start_time, slot.end_time);
    }
  });

  replace();

  const updated = db.prepare(
    'SELECT day_of_week, start_time, end_time FROM availability WHERE user_id = ? ORDER BY day_of_week'
  ).all(req.user.id);

  res.json(updated);
});

module.exports = router;
