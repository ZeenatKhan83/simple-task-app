const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const PasswordReset = require('../models/passwordResetModel');
const { sendOtpEmail } = require('../utils/mailer');

const JWT_SECRET = 'cosmic_momentum_super_secret_key';
const OTP_EXPIRY_MINUTES = 10;

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  User.findByEmailOrUsername(username, (err, existingUser) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email is already taken.' });
    }

    User.findByEmailOrUsername(email, async (errEmail, existingEmail) => {
      if (errEmail) return res.status(500).json({ error: errEmail.message });
      if (existingEmail) {
        return res.status(400).json({ message: 'Username or email is already taken.' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        User.create(username, email, hashedPassword, (createErr, newUserId) => {
          if (createErr) return res.status(500).json({ error: createErr.message });

          const token = jwt.sign({ userId: newUserId, username, email }, JWT_SECRET, { expiresIn: '24h' });
          res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: { id: newUserId, username, email }
          });
        });
      } catch (hashError) {
        res.status(500).json({ error: 'Password encryption failed.' });
      }
    });
  });
};

exports.login = (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be username or email

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username/email and password are required.' });
  }

  User.findByEmailOrUsername(identifier, async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

      const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        message: 'Login successful!',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (compareError) {
      res.status(500).json({ error: 'Authentication processing failed.' });
    }
  });
};

// --- FORGOT PASSWORD: STEP 1 — Request an OTP be emailed to the user ---
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  // Generic response either way — never reveal whether an email is registered
  const genericResponse = { message: 'If that email is registered, a reset code has been sent to it.' };

  User.findByEmailOrUsername(email, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    // Don't leak whether the account exists — respond the same way regardless
    if (!user) return res.json(genericResponse);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    PasswordReset.invalidateExisting(user.id, (invalidateErr) => {
      if (invalidateErr) return res.status(500).json({ error: invalidateErr.message });

      PasswordReset.create(user.id, otp, expiresAt, async (createErr) => {
        if (createErr) return res.status(500).json({ error: createErr.message });

        try {
          await sendOtpEmail(user.email, otp);
          res.json(genericResponse);
        } catch (mailErr) {
          console.error('Failed to send OTP email:', mailErr.message);
          res.status(500).json({ message: 'Could not send the reset email. Please try again shortly.' });
        }
      });
    });
  });
};

// --- FORGOT PASSWORD: STEP 2 — Verify the OTP and set a new password ---
exports.resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, code, and new password are all required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  User.findByEmailOrUsername(email, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ message: 'Invalid or expired code.' });

    PasswordReset.findValid(user.id, otp, async (findErr, resetRecord) => {
      if (findErr) return res.status(500).json({ error: findErr.message });
      if (!resetRecord) return res.status(400).json({ message: 'Invalid or expired code.' });

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        User.updatePassword(user.id, hashedPassword, (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message });

          // One-time use — remove the OTP so it can't be replayed
          PasswordReset.deleteById(resetRecord.id, () => {
            res.json({ message: 'Password reset successfully! You can now sign in.' });
          });
        });
      } catch (hashError) {
        res.status(500).json({ error: 'Password encryption failed.' });
      }
    });
  });
};