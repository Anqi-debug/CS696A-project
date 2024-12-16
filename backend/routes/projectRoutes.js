const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../middleware/upload'); // Import multer configuration

// Create a new project with file upload
router.post(
  '/recurring-fundraiser',
  upload.array('portfolio', 5), // Accept up to 5 files under the 'portfolio' field
  projectController.createRecurringFundraiser
);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get all approved projects
router.get('/approved', projectController.getApprovedProjects);

// Get a specific project by ID
router.get('/:projectId', projectController.getProjectById);

// Update a project by ID
router.put('/:projectId', projectController.updateProject);

// Delete a project by ID
router.delete('/:projectId', projectController.deleteProject);

//Create a milestone
router.get('/:projectId/milestones', projectController.getProjectMilestones);

// Get all projects by a specific creator
router.get('/creator/:creatorId', projectController.getProjectsByCreator);

module.exports = router;
