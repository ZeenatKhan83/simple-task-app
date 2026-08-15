const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = 'cosmic_momentum_super_secret_key';

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