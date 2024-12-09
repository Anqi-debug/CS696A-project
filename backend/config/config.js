require('dotenv').config(); // Load environment variables from .env

module.exports = {
    // Use the secret key from .env or a default value
    jwtSecretKey: process.env.JWT_SECRET || 'defaultSecretKey',

    // Expiration time for JWT token (use .env or default to 10 hours)
    expireIn: process.env.JWT_EXPIRE_IN || '10h',
};
