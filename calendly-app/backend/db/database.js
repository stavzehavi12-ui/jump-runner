const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './calendly.db';
const db = new Database(dbPath);

// Apply schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const statements = schema.split(';').map(s => s.trim()).filter(Boolean);
for (const stmt of statements) {
  db.exec(stmt + ';');
}

module.exports = db;
