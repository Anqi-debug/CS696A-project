// routes/milestoneRoutes.js
const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');

// Route to create a new milestone
router.post('/', milestoneController.createMilestone);

// Route to get all milestones for a specific project
router.get('/project/:projectId', milestoneController.getMilestonesByProject);

// Route to update a specific milestone
router.put('/:milestoneId', milestoneController.updateMilestone);

// Route to mark a milestone as completed
router.patch('/:milestoneId/complete', milestoneController.completeMilestone);

// Route to delete a milestone
router.delete('/:milestoneId', milestoneController.deleteMilestone);

module.exports = router;
