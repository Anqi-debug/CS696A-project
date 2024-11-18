const express = require('express');
const router = express.Router();
const recurringDonationController = require('../controllers/recurringDonationController');

router.post('/', recurringDonationController.createRecurringDonation);
router.get('/user/:donorId', recurringDonationController.getUserRecurringDonations);
router.put('/:donationId', recurringDonationController.updateRecurringDonation);
router.patch('/:donationId/cancel', recurringDonationController.cancelRecurringDonation);

module.exports = router;
