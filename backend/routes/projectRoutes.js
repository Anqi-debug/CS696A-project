// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Create a new project
router.post('/projects', projectController.createProject);

// Get all projects
router.get('/projects', projectController.getAllProjects);

// Get a specific project by ID
router.get('/projects/:projectId', projectController.getProjectById);

// Update a project by ID
router.put('/projects/:projectId', projectController.updateProject);

// Delete a project by ID
router.delete('/projects/:projectId', projectController.deleteProject);

module.exports = router;
