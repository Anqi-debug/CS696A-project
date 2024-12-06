const Milestone = require('../models/milestone.model');
const mongoose = require('mongoose');

// Create a new milestone
exports.createMilestone = async (req, res) => {
    try {
        const { projectId, milestoneGoal } = req.body;

        if (!projectId || !milestoneGoal) {
            return res.status(400).json({ message: 'Project ID and milestone goal are required.' });
        }

        const newMilestone = new Milestone({
            projectId,
            milestoneGoal,
            isComplete: false,
            completionDate: null,
        });

        const savedMilestone = await newMilestone.save();

        res.status(201).json({
            message: 'Milestone created successfully',
            milestone: savedMilestone,
        });
    } catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({ message: 'Error creating milestone', error: error.message });
    }
};

// Mark a milestone as complete
exports.markMilestoneComplete = async (req, res) => {
    try {
        const milestoneId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
            return res.status(400).json({ message: 'Invalid milestone ID.' });
        }

        const milestone = await Milestone.findById(milestoneId);

        if (!milestone) {
            return res.status(404).json({ message: 'Milestone not found.' });
        }

        if (milestone.isComplete) {
            return res.status(400).json({ message: 'Milestone is already complete.' });
        }

        milestone.isComplete = true;
        milestone.completionDate = new Date();

        const updatedMilestone = await milestone.save();

        res.status(200).json({
            message: 'Milestone marked as complete',
            milestone: updatedMilestone,
        });
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({ message: 'Error updating milestone', error: error.message });
    }
};

// Get all milestones for a project
exports.getMilestonesByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID.' });
        }

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
        res.status(500).json({ message: 'Error retrieving milestones', error: error.message });
    }
};

// Delete a milestone
exports.deleteMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;

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
        res.status(500).json({ message: 'Error deleting milestone', error: error.message });
    }
};
