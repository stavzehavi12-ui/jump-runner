const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { signToken } = require('../utils/jwtHelpers');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, timezone = 'UTC' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }
    if (username.length < 3 || !/^[a-z0-9_-]+$/i.test(username)) {
      return res.status(400).json({ error: 'Username must be at least 3 characters and only contain letters, numbers, hyphens, and underscores' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existing) {
      return res.status(400).json({ error: 'Username or email already taken' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash, timezone) VALUES (?, ?, ?, ?)'
    ).run(username.toLowerCase(), email.toLowerCase(), password_hash, timezone);

    const user = { id: result.lastInsertRowid, username: username.toLowerCase(), email: email.toLowerCase(), timezone };
    const token = signToken(user.id);

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user.id);
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
