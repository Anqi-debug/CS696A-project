const express = require('express');
const connectDB = require('./db/connection');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const config = require('./config/config');
const Joi = require('joi');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
require('dotenv').config();

// Create server instance
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS middleware (configured if needed)
// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials (if needed)
}));

// Parse the form middleware for application/x-www-form-urlencoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Define a custom `res.cc` function
app.use((req, res, next) => {
  res.cc = (message, status = 500) => {
    res.status(status).json({ message });
  };
  next();
});

// JWT middleware for protected routes
app.use(jwt({ 
  secret: config.jwtSecretKey, 
  algorithms: ['HS256']
}).unless({
  path: [
      /^\/api\//,    // Exclude routes starting with /api/ (e.g., for login)
      /^\/profile\//,      // Exclude /my/ routes
  ]
}));

// JWT verification for each request
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jwt.verify(req.headers.authorization.split(' ')[1], config.jwtSecretKey, function (err, decode) {
          if (err) req.user = undefined;
          req.user = decode;
          next();
      });
  } else {
      req.user = undefined;
      next();
  }
});

const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectRoutes');
const donationRoutes = require('./routes/donationRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', donationRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api', notificationRoutes);
app.use('/api', adminRoutes);
app.use('/api/metrics', metricsRoutes);

// Handle Joi validation errors
app.use((err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
      return res.cc(err.details[0].message, 400);  // Use custom response
  }

  // Handle UnauthorizedError from express-jwt
  if (err.name === 'UnauthorizedError') {
      return res.cc('Unauthorized access. Please provide a valid token.', 401);
  }

  // Log any other errors and send a generic message
  console.error(err.stack);
  res.cc('Something went wrong. Please try again later.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
