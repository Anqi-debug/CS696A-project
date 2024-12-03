const Joi = require('joi');

// Validation schema for creating a new user
const userSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(10)
    .required()
    .messages({
      'string.base': 'Username should be a string',
      'string.alphanum': 'Username should only contain alphanumeric characters',
      'string.min': 'Username should have at least 3 characters',
      'string.max': 'Username should not be longer than 10 characters',
      'any.required': 'Username is required',
    }),
  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,50}$/)
    .messages({
      'string.base': '"password" should be a string',
      'string.min': '"password" should have at least 8 characters',
      'string.max': '"password" should not exceed 50 characters',
      'string.pattern.base': '"password" must contain at least one letter and one number',
      'any.required': '"password" is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': '"email" should be a string',
      'string.email': '"email" must be a valid email address',
      'any.required': '"email" is required',
    }),
});

// Validation schema for updating a user
const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  // Add more fields if necessary
}).messages({
  'string.base': 'Field should be a string',
  'string.email': 'Field must be a valid email address',
});

// Validation schema for changing a password
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': 'Current password must be a string',
      'string.min': 'Current password must be at least 8 characters',
      'any.required': 'Current password is required',
    }),
  newPassword: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': 'New password must be a string',
      'string.min': 'New password must be at least 8 characters',
      'any.required': 'New password is required',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'New password and confirmation password must match',
      'any.required': 'Confirm password is required',
    }),
});

// Export all schemas in a single object to avoid overwriting
module.exports = {
  userSchema,
  updateUserSchema,
  changePasswordSchema,
};
