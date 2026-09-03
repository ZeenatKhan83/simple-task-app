const db = require('../config/database');

const PasswordReset = {
  // Remove any previous unused OTPs for this user before issuing a new one
  invalidateExisting: (userId, callback) => {
    db.run('DELETE FROM password_resets WHERE userId = ?', [userId], callback);
  },

  create: (userId, otp, expiresAt, callback) => {
    const sql = 'INSERT INTO password_resets (userId, otp, expiresAt) VALUES (?, ?, ?)';
    db.run(sql, [userId, otp, expiresAt], function (err) {
      callback(err, this ? this.lastID : null);
    });
  },

  // Find a non-expired OTP record matching this user + code
  findValid: (userId, otp, callback) => {
    const sql = `
      SELECT * FROM password_resets 
      WHERE userId = ? AND otp = ? AND expiresAt > datetime('now')
      ORDER BY id DESC LIMIT 1
    `;
    db.get(sql, [userId, otp], callback);
  },

  // One-time use: delete the record once it's been consumed
  deleteById: (id, callback) => {
    db.run('DELETE FROM password_resets WHERE id = ?', [id], callback);
  }
};

module.exports = PasswordReset;
