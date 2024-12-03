const express = require('express');
const router = express.Router(); 

//obtain the category of the project
const project_controller=require('../controller/project')

const verifyToken=require('../middleware/authZMiddleware')
const roleAuth = require('../middleware/roleAuth'); // Import the role-based auth middleware



// Get projects by category
router.get(
    '/category',
    verifyToken,
    roleAuth(['Donor', 'Creator', 'Admin']),
    project_controller.category
);

// Create a new project
router.post(
    '/project',
    verifyToken,
    roleAuth(['Creator', 'Admin']),
    project_controller.createProject
);

// Update project details
router.put(
    '/:projectId',
    verifyToken,
    roleAuth(['Creator', 'Admin']),
    project_controller.updateProject
);

// Cancel a project
router.patch(
    '/:projectId/:status',
    verifyToken,
    roleAuth(['Creator', 'Admin']),
    project_controller.cancelProject
);

// View project details
router.get(
    '/:projectId',
    verifyToken,
    roleAuth(['Donor', 'Creator', 'Admin']),
    project_controller.viewProject
);
module.exports = router;
