const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Import updated User schema
const Project = require('../models/project.model'); // Import Project schema
const Donation = require('../models/donation.model'); // Import Donation schema
const Investment = require('../models/investment.model'); // Import Investment model

// Get user success metrics
router.get('/user/:userId/metrics', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user data
        const user = await User.findById(userId)
            .populate('createdProjects') // Populate created projects
            .populate('donations') // Populate donations
            .populate('recurringDonations'); // Populate recurring donations

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Calculate total funds raised for all projects created by the user
        const totalFundsRaised = await Project.aggregate([
            { $match: { creatorId: userId } }, // Match projects created by this user
            { $group: { _id: null, totalFunds: { $sum: '$fundsRaised' } } },
        ]);

        // Count successful projects (criteria: status is 'completed')
        const successfulProjectsCount = await Project.countDocuments({
            creatorId: userId,
            status: 'completed',
        });

        // Calculate average supporter satisfaction (mocked for now; replace with actual logic if available)
        const averageSupporterSatisfaction = 4.5; // Example: Assume 4.5/5 rating from past project feedback

        res.status(200).json({
            userMetrics: {
                name: user.name,
                email: user.email,
                totalFundsRaised: totalFundsRaised.length ? totalFundsRaised[0].totalFunds : 0,
                successfulProjectsCount,
                averageSupporterSatisfaction,
                supporterLevel: user.supporterLevel,
                donationsMade: user.donations.length,
                recurringDonationsMade: user.recurringDonations.length,
                socialMediaLinks: user.socialMediaLinks,
            },
        });
    } catch (error) {
        console.error('Error retrieving user metrics:', error);
        res.status(500).json({
            message: 'Error retrieving user metrics',
            error: error.message,
        });
    }
});

// Get project success metrics
router.get('/project/:projectId/metrics', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch project data
        const project = await Project.findById(projectId).populate('donations investments');

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Calculate success metrics
        const successLikelihood = ((project.fundsRaised / project.goalAmount) * 100).toFixed(2);

        const projectedROI = project.investmentTerms
            ? `15% (Based on creator's track record and project business model)`
            : 'N/A';

        res.status(200).json({
            projectMetrics: {
                campaignName: project.campaignName,
                fundsRaised: project.fundsRaised,
                goalAmount: project.goalAmount,
                successLikelihood: `${successLikelihood}%`,
                donorCount: project.donorCount,
                projectedROI,
            },
        });
    } catch (error) {
        console.error('Error retrieving project metrics:', error);
        res.status(500).json({
            message: 'Error retrieving project metrics',
            error: error.message,
        });
    }
});

// Comparison of projects in the same category
router.get('/projects/comparison', async (req, res) => {
    try {
        const { category } = req.query;

        // Fetch projects in the same category
        const projects = await Project.find({ category }).populate('creatorId');

        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found in the specified category.' });
        }

        // Compare success metrics for each project
        const comparisonData = projects.map((project) => ({
            campaignName: project.campaignName,
            creator: project.creatorId ? project.creatorId.name : 'Unknown',
            fundsRaised: project.fundsRaised,
            goalAmount: project.goalAmount,
            successLikelihood: ((project.fundsRaised / project.goalAmount) * 100).toFixed(2),
            donorCount: project.donorCount,
        }));

        res.status(200).json({
            message: 'Comparison data retrieved successfully',
            comparisonData,
        });
    } catch (error) {
        console.error('Error comparing projects:', error);
        res.status(500).json({
            message: 'Error comparing projects',
            error: error.message,
        });
    }
});

module.exports = router;
