const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorizeRoles = require('../middleware/roleAuth');
const authenticate = require('../middleware/authZMiddleware');

// Route to list all pending fundraiser applications
//router.get('/fundraisers', authenticate, authorizeRoles('admin'), adminController.getPendingFundraisers);
router.get('/fundraisers', adminController.getPendingFundraisers);

// Route to approve a fundraiser
//router.patch('/fundraisers/:projectId/approve', authenticate, authorizeRoles('admin'), adminController.approveFundraiser);
router.patch('/fundraisers/:projectId/approve', adminController.approveFundraiser);
// Route to reject a fundraiser
//router.patch('/fundraisers/:projectId/reject', authenticate, authorizeRoles('admin'), adminController.rejectFundraiser);
router.patch('/fundraisers/:projectId/reject', adminController.rejectFundraiser);

module.exports = router;
