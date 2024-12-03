// 1. register request
// 2. login request

const express = require('express');
const router = express.Router(); // Use express.Router()
const user_controller = require('../controller/user');
//import the middleware of validating the input data
const validator=require('express-joi-validation').createValidator();
// import the validation rules 
const {userSchema}=require('../schema/user')

// Connect to MongoDB


// Registration recall the registration function from '../controller/user'
router.post('/registration',validator.body(userSchema),user_controller.registration);
// Login, recall the function 
router.post('/login',validator.body(userSchema),user_controller.login);

module.exports = router;

