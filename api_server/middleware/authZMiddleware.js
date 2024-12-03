const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Authentication Middleware
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header('Authorization') || req.header('authorization');

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }
  
  // Extract token from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message:'No token provided, authorization denied.'});
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, config.jwtSecretKey);

    // Attach user data to the request object (e.g., user ID and role)
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
