const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/stripe', donationController.processStripePayment);
router.get('/user/:donorId', donationController.getUserDonation);
router.put('/:donationId', donationController.updateDonation);
router.patch('/:donationId/cancel', donationController.cancelDonation);

module.exports = router;
