const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

router.post('/', investmentController.createInvestment);
router.get('/user/:donorId', investmentController.getUserInvestments);
router.patch('/:investmentId/status', investmentController.updateInvestmentStatus);

module.exports = router;
