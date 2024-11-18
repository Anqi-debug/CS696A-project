const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.registerUser);
router.put('/:userId', userController.updatePortfolio);
router.get('/:userId', userController.getPortfolio);

module.exports = router;
