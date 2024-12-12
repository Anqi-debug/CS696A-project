const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.patch('/password', userController.changePassword);
router.put('/:userId/portfolio', userController.updatePortfolio);
router.get('/:userId/portfolio', userController.getPortfolio);

// Create a new user
router.post('/createUser', userController.createUser);

// Add a recurring donation
router.post('/recurring-donation', userController.addRecurringDonation);

// Get user with populated recurring donations
router.get('/:userId/donations', userController.getDonationsUserById);

module.exports = router;
