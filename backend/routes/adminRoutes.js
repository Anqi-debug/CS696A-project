const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to list all pending fundraiser applications
router.get('/fundraisers', adminController.getPendingFundraisers);

// Route to approve a fundraiser
router.patch('/fundraisers/:projectId/approve', adminController.approveFundraiser);

// Route to reject a fundraiser
router.patch('/fundraisers/:projectId/reject', adminController.rejectFundraiser);

module.exports = router;
