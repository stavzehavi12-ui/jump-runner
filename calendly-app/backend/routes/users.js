const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/:username', (req, res) => {
  const user = db.prepare(
    'SELECT id, username, timezone FROM users WHERE username = ?'
  ).get(req.params.username.toLowerCase());

  if (!user) return res.status(404).json({ error: 'User not found' });

  const meetingTypes = db.prepare(
    'SELECT title, slug, duration, description FROM meeting_types WHERE user_id = ? ORDER BY created_at ASC'
  ).all(user.id);

  res.json({ username: user.username, timezone: user.timezone, meetingTypes });
});

module.exports = router;
