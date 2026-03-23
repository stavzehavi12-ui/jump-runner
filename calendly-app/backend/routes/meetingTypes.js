const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function uniqueSlug(userId, baseSlug) {
  let slug = baseSlug;
  let i = 2;
  while (db.prepare('SELECT id FROM meeting_types WHERE user_id = ? AND slug = ?').get(userId, slug)) {
    slug = `${baseSlug}-${i++}`;
  }
  return slug;
}

router.get('/', requireAuth, (req, res) => {
  const types = db.prepare(
    'SELECT * FROM meeting_types WHERE user_id = ? ORDER BY created_at ASC'
  ).all(req.user.id);
  res.json(types);
});

router.post('/', requireAuth, (req, res) => {
  const { title, duration, buffer_time = 0, description = '' } = req.body;

  if (!title || !duration) {
    return res.status(400).json({ error: 'title and duration are required' });
  }
  if (![15, 30, 60].includes(Number(duration))) {
    return res.status(400).json({ error: 'duration must be 15, 30, or 60' });
  }

  const baseSlug = generateSlug(title);
  const slug = uniqueSlug(req.user.id, baseSlug);

  const result = db.prepare(
    'INSERT INTO meeting_types (user_id, title, slug, duration, buffer_time, description) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, title, slug, Number(duration), Number(buffer_time), description);

  const created = db.prepare('SELECT * FROM meeting_types WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

router.put('/:id', requireAuth, (req, res) => {
  const mt = db.prepare('SELECT * FROM meeting_types WHERE id = ?').get(req.params.id);
  if (!mt) return res.status(404).json({ error: 'Not found' });
  if (mt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { title, duration, buffer_time, description } = req.body;
  const updated = {
    title: title ?? mt.title,
    duration: duration !== undefined ? Number(duration) : mt.duration,
    buffer_time: buffer_time !== undefined ? Number(buffer_time) : mt.buffer_time,
    description: description ?? mt.description,
  };

  if (![15, 30, 60].includes(updated.duration)) {
    return res.status(400).json({ error: 'duration must be 15, 30, or 60' });
  }

  db.prepare(
    'UPDATE meeting_types SET title=?, duration=?, buffer_time=?, description=? WHERE id=?'
  ).run(updated.title, updated.duration, updated.buffer_time, updated.description, mt.id);

  res.json(db.prepare('SELECT * FROM meeting_types WHERE id = ?').get(mt.id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const mt = db.prepare('SELECT * FROM meeting_types WHERE id = ?').get(req.params.id);
  if (!mt) return res.status(404).json({ error: 'Not found' });
  if (mt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  db.prepare('DELETE FROM meeting_types WHERE id = ?').run(mt.id);
  res.status(204).send();
});

module.exports = router;
