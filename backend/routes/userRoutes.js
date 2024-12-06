const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//import the middleware of validating the input data
//const validator=require('express-joi-validation').createValidator();
// import the validation rules 
//const {userSchema}=require('../models/user')

// Registration recall the registration function from '../controller/user'
//router.post('/users/registration',validator.body(userSchema),userController.registration);
// Login, recall the function 
//router.post('/users/login',validator.body(userSchema),userController.login);

// Route to change password
//router.patch('/userinfo/password', validator.body(userSchema), userController.changePassword);

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
