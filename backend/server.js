const express = require('express');
const connectDB = require('./db/connection');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const config = require('./config/config');
const Joi = require('joi');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

// Create server instance
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Adjust for production
    methods: '*',
    allowedHeaders: '*',
}));

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
    algorithms: ['HS256'],
}).unless({
    path: [
        /^\/api\//, // Exclude routes starting with /api/
    ],
}));

// JWT verification middleware
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], config.jwtSecretKey, (err, decode) => {
            if (!err) {
                req.user = decode;
            } else {
                req.user = undefined;
            }
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

// Import routes
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
app.use('/api/donations', donationRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.IO Integration
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

/*io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Listen for user-specific events
    socket.on('register', (userId) => {
        console.log(`User registered with ID: ${userId}`);
        socket.join(userId); // Join a room specific to the user's ID
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`Socket ${id} joined room ${room}`);
});*/

// Make the Socket.IO instance available globally
//app.set('socketio', io);

// Handle Joi validation errors
app.use((err, req, res, next) => {
    if (err instanceof Joi.ValidationError) {
        return res.cc(err.details[0].message, 400);
    }

    if (err.name === 'UnauthorizedError') {
        return res.cc('Unauthorized access. Please provide a valid token.', 401);
    }

    console.error(err.stack);
    res.cc('Something went wrong. Please try again later.');
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
