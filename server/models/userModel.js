const db = require('../config/database');

const User = {
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], callback);
  },

  findByEmailOrUsername: (identifier, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.get(sql, [identifier, identifier], callback);
  },

  create: (username, email, hashedPassword, callback) => {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sql, [username, email, hashedPassword], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }
};

module.exports = User;