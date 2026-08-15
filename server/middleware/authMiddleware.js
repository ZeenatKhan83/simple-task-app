const jwt = require('jsonwebtoken');
const JWT_SECRET = 'cosmic_momentum_super_secret_key'; // Must perfectly match your authController key

const authMiddleware = (req, res, next) => {
  // Pull token out of the Authorization header format: "Bearer TOKEN_STRING"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Security passport token missing.' });
  }

  try {
    // Decode and verify token signature integrity
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { userId, username }
    next(); // Pass control smoothly to the next handler function
  } catch (err) {
    res.status(403).json({ message: 'Session expired or passport token invalid.' });
  }
};

module.exports = authMiddleware;