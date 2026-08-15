const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'momentum.db');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database at:', dbPath);

  db.serialize(() => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON;');

    // 1. Create Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else console.log('Users table initialized.');
    });

    // Fallback: Add email column if opening an old existing DB
    db.run(`ALTER TABLE users ADD COLUMN email TEXT;`, () => {
      // Safely ignores error if column already exists
    });

    // 2. Create Tasks Table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        priority TEXT DEFAULT 'medium',
        dueDate TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // 3. Create Subtasks Table
    db.run(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId INTEGER NOT NULL,
        title TEXT NOT NULL,
        isCompleted INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
      )
    `);

    // 4. Create Activity Log Table
    db.run(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        taskId INTEGER NOT NULL,
        action TEXT DEFAULT 'completed',
        completedAt DATE DEFAULT (DATE('now')),
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
  });
});

module.exports = db;