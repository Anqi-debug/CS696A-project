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

// Other routes remain the same
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

module.exports = router;
