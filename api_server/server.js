// Import the express module
const express = require('express');
const connectDB = require('./db/connection');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const config = require('./config/config');
const Joi = require('joi');
const app = express();

// Create server instance
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// CORS middleware (configured if needed)
app.use(cors({
    origin: ['http://yourdomain.com', 'http://anotherdomain.com'] // specify your allowed origins here
}));

// Parse the form middleware for application/x-www-form-urlencoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// Import and use the router module
const userRouter = require('./router/user');
app.use('/api', userRouter);

const userInfoRouter=require('./router/userinfo');
app.use('/profile',userInfoRouter)


const projectRouter=require('./router/project')
app.use('/project',projectRouter)

const donationRouter=require('./router/donation')
app.use('/donation',donationRouter)

//const notificationRouter=require('./router/notification')
//app.use('/notification',notification)



// Handle Joi validation errors
app.use((err, req, res, next) => {
    if (err instanceof Joi.ValidationError) {
        return res.cc(err.details[0].message);  // Send validation error message
    }

    // Handle UnauthorizedError from express-jwt
    if (err.name === 'UnauthorizedError') {
        return res.cc('Unauthorized access. Please provide a valid token.');
    }

    // Log any other errors and send a generic message
    console.error(err.stack);
    res.cc('Something went wrong. Please try again later.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`API server is running at http://127.0.0.1:${PORT}`);
});
