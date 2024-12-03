const express = require('express');
const router = express.Router(); 

const donationController = require('../controller/donation');

const verifyToken=require('../middleware/authZMiddleware')
const roleAuth = require('../middleware/roleAuth'); // Import the role-based auth middleware


// Endpoint to create a donation
router.post('/:projectId', verifyToken,
    roleAuth(['Donor']),donationController.createDonation);

module.exports = router;
