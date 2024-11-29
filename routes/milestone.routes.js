const express = require('express');
const router = express.Router();
const Milestone = require('../models/milestone.model');
const Project = require('../models/project.model');
const mongoose = require('mongoose');

// Create a new milestone
router.post('/create', async (req, res) => {
    try {
        const { projectId, milestoneGoal } = req.body;

        // Validate input fields
        if (!projectId || !milestoneGoal) {
            return res.status(400).json({ message: 'Project ID and milestone goal are required.' });
        }

        // Create the milestone
        const newMilestone = new Milestone({
            projectId,
            milestoneGoal,
            isComplete: false,
            completionDate: null,
        });

        // Save the milestone
        const savedMilestone = await newMilestone.save();

        res.status(201).json({
            message: 'Milestone created successfully',
            milestone: savedMilestone,
        });
    } catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({
            message: 'Error creating milestone',
            error: error.message,
        });
    }
});


// Mark milestone as complete
router.put('/complete/:id', async (req, res) => {
    try {
        const milestoneId = req.params.id;

        // Convert the string to a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
            return res.status(400).json({ message: 'Invalid milestone ID.' });
        }

        // Find the milestone by ID
        const milestone = await Milestone.findById(milestoneId);

        // Check if the milestone exists
        if (!milestone) {
            return res.status(404).json({ message: 'Milestone not found.' });
        }

        // Check if the milestone is already marked as complete
        if (milestone.isComplete) {
            return res.status(400).json({ message: 'Milestone is already complete.' });
        }

        // Mark the milestone as complete
        milestone.isComplete = true;
        milestone.completionDate = new Date();  // Set completion date to now

        // Save the updated milestone
        const updatedMilestone = await milestone.save();

        res.status(200).json({
            message: 'Milestone marked as complete',
            milestone: updatedMilestone,
        });
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({
            message: 'Error updating milestone',
            error: error.message,
        });
    }
});

// Get all milestones for a project
router.get('/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Validate projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID.' });
        }

        // Find milestones directly by projectId
        const milestones = await Milestone.find({ projectId });

        if (!milestones.length) {
            return res.status(404).json({ message: 'No milestones found for this project.' });
        }

        res.status(200).json({
            message: 'Milestones retrieved successfully',
            milestones,
        });
    } catch (error) {
        console.error('Error retrieving milestones:', error);
        res.status(500).json({
            message: 'Error retrieving milestones',
            error: error.message,
        });
    }
});

// Delete a milestone
router.delete('/delete/:milestoneId', async (req, res) => {
    try {
        const { milestoneId } = req.params;

        // Find and delete the milestone by ID
        const deletedMilestone = await Milestone.findByIdAndDelete(milestoneId);

        if (!deletedMilestone) {
            return res.status(404).json({ message: 'Milestone not found.' });
        }

        res.status(200).json({
            message: 'Milestone deleted successfully',
            milestone: deletedMilestone,
        });
    } catch (error) {
        console.error('Error deleting milestone:', error);
        res.status(500).json({
            message: 'Error deleting milestone',
            error: error.message,
        });
    }
});

module.exports = router;
