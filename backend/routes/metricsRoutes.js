const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

// Get user success metrics
router.get('/user/:userId/metrics', metricsController.getUserMetrics);

// Get project success metrics
router.get('/project/:projectId/metrics', metricsController.getProjectMetrics);

// Compare projects in the same category
router.get('/projects/comparison', metricsController.compareProjects);

module.exports = router;
