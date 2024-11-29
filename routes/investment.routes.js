const express = require('express');
const router = express.Router();
const Investment = require('../models/investment.model'); // Investment model
const Project = require('../models/project.model'); // Project model
const User = require('../models/user.model'); // User model

// Create a new investment
router.post('/create', async (req, res) => {
    try {
        const { donorId, projectId, investmentAmount, potentialReturns } = req.body; // donorID is user id of user collection

        // Ensure that the project and user exist
        const project = await Project.findById(projectId);
        const user = await User.findById(donorId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User (Donor) not found.' });
        }

        // Create a new investment
        const newInvestment = new Investment({
            donorId,
            projectId,
            investmentAmount,
            potentialReturns
        });

        // Save the investment
        await newInvestment.save();

        // Optionally, you can update the project to include the new investment
        project.investments.push(newInvestment._id);
        await project.save();

        // Return the created investment
        res.status(201).json({
            message: 'Investment created successfully',
            investment: newInvestment
        });
    } catch (error) {
        console.error('Error creating investment:', error);
        res.status(500).json({
            message: 'Error creating investment',
            error: error.message
        });
    }
});

// Get all investments for a specific project
router.get('/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch the project
        const project = await Project.findById(projectId).populate('investments');

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Return all investments for the project
        res.status(200).json({
            message: 'Investments retrieved successfully',
            investments: project.investments
        });
    } catch (error) {
        console.error('Error retrieving investments:', error);
        res.status(500).json({
            message: 'Error retrieving investments',
            error: error.message
        });
    }
});

// Get all investments made by a specific donor (user)
router.get('/user/:donorId', async (req, res) => {
    try {
        const { donorId } = req.params;

        // Fetch all investments made by the donor
        const investments = await Investment.find({ donorId }).populate('projectId');

        if (!investments.length) {
            return res.status(404).json({ message: 'No investments found for this donor.' });
        }

        // Return the list of investments
        res.status(200).json({
            message: 'Investments retrieved successfully',
            investments: investments
        });
    } catch (error) {
        console.error('Error retrieving investments by donor:', error);
        res.status(500).json({
            message: 'Error retrieving investments by donor',
            error: error.message
        });
    }
});

// Update an existing investment (e.g., change the investment amount or potential returns)
router.put('/update/:investmentId', async (req, res) => {
    try {
        const { investmentId } = req.params;
        const { investmentAmount, potentialReturns } = req.body;

        // Find the investment by ID and update it
        const updatedInvestment = await Investment.findByIdAndUpdate(
            investmentId,
            { investmentAmount, potentialReturns },
            { new: true }
        );

        if (!updatedInvestment) {
            return res.status(404).json({ message: 'Investment not found.' });
        }

        res.status(200).json({
            message: 'Investment updated successfully',
            investment: updatedInvestment
        });
    } catch (error) {
        console.error('Error updating investment:', error);
        res.status(500).json({
            message: 'Error updating investment',
            error: error.message
        });
    }
});

// Delete an investment
router.delete('/delete/:investmentId', async (req, res) => {
    try {
        const { investmentId } = req.params;

        // Find the investment and delete it
        const deletedInvestment = await Investment.findByIdAndDelete(investmentId);

        if (!deletedInvestment) {
            return res.status(404).json({ message: 'Investment not found.' });
        }

        // Optionally, you can also remove this investment from the associated project
        const project = await Project.findById(deletedInvestment.projectId);
        if (project) {
            project.investments = project.investments.filter(
                (investment) => investment.toString() !== investmentId
            );
            await project.save();
        }

        res.status(200).json({
            message: 'Investment deleted successfully',
            investment: deletedInvestment
        });
    } catch (error) {
        console.error('Error deleting investment:', error);
        res.status(500).json({
            message: 'Error deleting investment',
            error: error.message
        });
    }
});

module.exports = router;
