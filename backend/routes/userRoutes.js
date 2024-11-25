const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.put('/users/:userId', userController.updatePortfolio);
router.get('/users/:userId', userController.getPortfolio);

module.exports = router;
