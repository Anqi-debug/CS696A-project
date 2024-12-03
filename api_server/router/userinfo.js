//for user to change their password

const express = require('express');
const router = express.Router(); // Use express.Router()
const validator=require('express-joi-validation').createValidator();
// import the validation rules 
const { updateUserSchema, changePasswordSchema } = require('../schema/user');

const userInfo_controller=require('../controller/userinfo')

router.get('./userinfo',userInfo_controller.getUserInfo)
// Route to update user info
router.put('/userinfo', validator.body(updateUserSchema), userInfo_controller.updateUserInfo);

// Route to change password
router.patch('/userinfo/password', validator.body(changePasswordSchema), userInfo_controller.changePassword);

module.exports = router;