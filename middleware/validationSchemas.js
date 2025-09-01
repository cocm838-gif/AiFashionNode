const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('./validation');
const { userRoles } = require('../utils/constants')


// Validation schemas object
const validationSchemas = {
  // Send OTP validation schema
  sendOTPSignUp: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('phone')
      .trim()
      .notEmpty()
      .isMobilePhone()
      .withMessage('Phone number is required'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Country code is required')
      .isLength({ min: 1, max: 4 })
      .withMessage('Country code must be between 1 and 4 characters')
      .matches(/^\+?\d+$/)
      .withMessage('Country code must contain only numbers and optional +'),
    handleValidationErrors
  ],
  sendOTP: [
    body('role')
      .optional() // role is not required in request body
      .isIn(Object.values(userRoles))
      .withMessage('Role must be USER, ADMIN, or MANUFACTURER')
      .default(userRoles.user),
    body('phone')
      .trim()
      .notEmpty()
      .isMobilePhone()
      .withMessage('Phone number is required'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Country code is required')
      .isLength({ min: 1, max: 4 })
      .withMessage('Country code must be between 1 and 4 characters')
      .matches(/^\+?\d+$/)
      .withMessage('Country code must contain only numbers and optional +'),
    handleValidationErrors
  ],

  // OTP verification validation schema
  verifyOTPSchema: [
    body('phone')
      .trim()
      .notEmpty()
      .isMobilePhone()
      .withMessage('Phone number is required'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Country code is required')
      .isLength({ min: 1, max: 4 })
      .withMessage('Country code must be between 1 and 4 characters')
      .matches(/^\+?\d+$/)
      .withMessage('Country code must contain only numbers and optional +'),
    body('otp')
      .trim()
      .notEmpty()
      .withMessage('OTP code is required')
      .isLength({ min: 4, max: 6 })
      .withMessage('OTP code must be between 4 and 6 digits')
      .isNumeric()
      .withMessage('OTP code must contain only numbers'),
    handleValidationErrors
  ],

  // Update profile (optional fields)
  updateProfileSchema: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 300 })
      .withMessage('Bio must be at most 300 characters'),
    body('isPrivatePost')
      .optional()
      .isBoolean()
      .withMessage('isPrivatePost must be a boolean')
      .toBoolean(),
    handleValidationErrors
  ],

  // Product create
  createProductSchema: [
    body('title').trim().notEmpty().isLength({ min: 2, max: 150 }).withMessage('Title is required (2-150 chars)'),
    body('price').notEmpty().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
    body('currency').optional().default('INR').isIn(['INR', 'USD', 'EUR', 'GBP', 'JPY']).withMessage('Invalid currency'),
    handleValidationErrors
  ],

  // Like / Skip actions
  likeProductSchema: [
    param('productId').notEmpty().isMongoId().withMessage('productId must be a valid MongoID'),
    handleValidationErrors
  ],
  skipProductSchema: [
    param('productId').notEmpty().isMongoId().withMessage('productId must be a valid MongoID'),
    handleValidationErrors
  ],

  // Pagination for likes/skips
  interactionsQuerySchema: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be an integer >= 1')
      .toInt()
      .default(1),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit must be between 1 and 100')
      .toInt()
      .default(20),
    handleValidationErrors
  ]

};

module.exports = validationSchemas;
