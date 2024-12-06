const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

// Create a new investment
router.post('/', investmentController.createInvestment);

// Get all investments for a specific project
router.get('/project/:projectId', investmentController.getInvestmentsByProject);

// Get all investments made by a specific donor (user)
router.get('/user/:donorId', investmentController.getInvestmentsByDonor);

// Update an existing investment
router.put('/:investmentId', investmentController.updateInvestment);

// Delete an investment
router.delete('/:investmentId', investmentController.deleteInvestment);

module.exports = router;
