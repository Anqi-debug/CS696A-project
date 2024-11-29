const express = require('express');
const router = express.Router();
const Project = require('../models/project.model');
const Donation = require('../models/donation.model');

// Create a new recurring fundraiser
router.post('/recurring-fundraiser', async (req, res) => {
    try {
        const {
            creatorId,
            campaignName,
            description,
            montlyGoal, // Corrected spelling from montlyGoal to monthlyGoal
            goalAmount,
            projectTimeline,
            status, // Adding status field
            portfolio, // Adding portfolio field
            //milestones, // Adding milestones field
            fundsRaised, // Adding fundsRaised field
            donorCount, // Adding donorCount field
            investmentTerms, // Adding investmentTerms field
            donationAmount,
            frequency,
        } = req.body;

        // Validate input fields
        if (
            !creatorId ||
            !campaignName ||
            !description ||
            !montlyGoal ||
            !goalAmount ||
            !projectTimeline ||
            !status ||
            !portfolio ||
            //!milestones ||
            !fundsRaised ||
            !donorCount ||
            !investmentTerms ||
            !donationAmount ||
            !frequency
        ) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create the project
        const newProject = new Project({
            creatorId,
            campaignName,
            description,
            montlyGoal,
            goalAmount,
            projectTimeline,
            status, // status field
            portfolio, // portfolio field
            //milestones, // milestones array
            fundsRaised, // initial funds raised
            donorCount, // donor count field
            investmentTerms, // investment terms
            donations: [], // Initialize empty donations array
            recurringDonations: [], // Initialize empty recurring donations array
            investments: [], // Initialize empty investments array
            updates: [], // Initialize empty updates array
        });

        // Save the new project
        const savedProject = await newProject.save();

        // Create a recurring donation
        const newDonation = new Donation({
            donorId: creatorId, // Assuming creator is also the donor for recurring donations
            projectId: savedProject._id,
            amount: donationAmount,
            frequency,
            nextPaymentDate: new Date(), // Set initial next payment date
            lastPaymentDate: null, // Initially, no payments have been made
            isActive: true, // Set recurring donation as active
        });

        // Save the donation
        const savedDonation = await newDonation.save();

        // Link the recurring donation to the project
        savedProject.recurringDonations.push(savedDonation._id);
        await savedProject.save();

        res.status(201).json({
            message: 'Recurring fundraiser created successfully',
            project: savedProject,
        });
    } catch (error) {
        console.error('Error creating recurring fundraiser:', error);
        res.status(500).json({
            message: 'Error creating recurring fundraiser',
            error: error.message,
        });
    }
});

module.exports = router;
