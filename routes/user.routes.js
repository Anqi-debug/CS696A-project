const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Adjust the path to your user model if needed
const Donation = require('../models/donation.model');

// POST route to create a new user
router.post('/create', async (req, res) => {
    try {
        const {
            name,
            email,
            role,
            createdProjects,
            donations,
            recurringDonations,
            socialMediaLink,
            supporterLevel,
            notifications,
        } = req.body;

        // Validate input fields
        if (!name || !email || !role) {
            return res.status(400).json({ message: 'Name, email, and role are required.' });
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            role,
            createdProjects: createdProjects || [], // Default to an empty array if not provided
            donations: donations || [],
            recurringDonations: recurringDonations || [],
            socialMediaLink: socialMediaLink || '',
            supporterLevel: supporterLevel || 'Basic', // Default level if not provided
            notifications: notifications || [],
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: savedUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,
        });
    }
});

// POST route to add a recurring donation
router.post('/addRecurringDonation', async (req, res) => {
    try {
        const { userId, amount, frequency, projectId } = req.body;

        // Validate required fields
        if (!userId || !amount || !frequency || !projectId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Donation data from the request body
        const donationData = {
            donorId: userId,  // Adding the donorId field
            amount,
            frequency,
            projectId,
            isActive: true,
            nextPaymentDate: new Date(), // Initialize with the current date
            lastPaymentDate: new Date(),
        };

        // Create the donation record
        const newDonation = new Donation(donationData);
        const savedDonation = await newDonation.save();

        // Add the donation ObjectId to the user's recurringDonations field
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Push the new donation's ID to the recurringDonations array
        user.recurringDonations.push(savedDonation._id);
        await user.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Recurring donation added successfully',
        });
    } catch (error) {
        console.error('Error adding recurring donation:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// GET route to fetch user with populated recurring donations
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch the user and populate the recurringDonations field
        const user = await User.findById(userId)
            .populate('recurringDonations') // Populate the recurring donations with the actual data
            .exec();

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Error fetching user with recurring donations:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
