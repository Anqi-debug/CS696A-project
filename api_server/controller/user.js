const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Registration function
exports.registration = async (req, res) => {
    const { username, password, email, role } = req.body;

    try {
        // Check for existing username and email in parallel
        const [existingUser, existingEmail] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email })
        ]);

        if (existingUser) {
            return res.status(400).json({ message: 'Username is already registered. Please use a different username.' });
        }

        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
        }

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const result = await newUser.save();

        if (!result) {
            return res.status(500).json({ message: 'Registration failed, please try again later.' });
        }

        // Optionally send a notification or log the success (if necessary)
        // const notificationResponse = await notificationService.createNotification(newUser._id, 'Registration successful. Welcome!', 'registration');
        // if (!notificationResponse.success) {
        //     console.error('Notification error:', notificationResponse.error);
        // }

        res.status(201).json({ message: 'Registration successful.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Search for the user by username or email
        const user = await User.findOne({
            $or: [{ username: username }, { email: email }] // Search by either username or email
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Use bcrypt.compare to verify the password asynchronously
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Remove password field from the user object
        const userWithoutPassword = { ...user.toObject(), password: '', role: user.role };

        // Generate a token with a payload and expiration
        const tokenStr = jwt.sign(userWithoutPassword, config.jwtSecretKey, { expiresIn: config.expireIn });

        res.status(200).json({
            message: 'Login successful',
            token: tokenStr
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
