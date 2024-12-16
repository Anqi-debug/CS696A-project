const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/stripe', donationController.processStripePayment);
router.put('/:donationId', donationController.updateDonation);
router.patch('/:donationId/cancel', donationController.cancelDonation);
router.get('/donor/:donorId/projects', donationController.getDonorProjects);

module.exports = router;
