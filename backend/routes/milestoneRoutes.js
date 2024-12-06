const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');

// Create a new milestone
router.post('/', milestoneController.createMilestone);

// Mark a milestone as complete
router.put('/:id/complete', milestoneController.markMilestoneComplete);

// Get all milestones for a project
router.get('/project/:projectId', milestoneController.getMilestonesByProject);

// Delete a milestone
router.delete('/:milestoneId', milestoneController.deleteMilestone);

module.exports = router;
