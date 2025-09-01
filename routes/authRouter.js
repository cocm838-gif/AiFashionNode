const router = require('express').Router();
const AuthController = require('../controllers/authController');
const { validationSchemas } = require('../middleware');

// Signup flow: send OTP if phone not registered
router.post('/send-otp/sign-up', validationSchemas.sendOTPSignUp,AuthController.sendSignupOtp);

// Signin flow: send OTP if phone exists
router.post('/send-otp/sign-in', validationSchemas.sendOTP,AuthController.sendSigninOtp);

// Verify OTP using Twilio Verify
router.post('/verify-otp', validationSchemas.verifyOTPSchema,AuthController.verifyOtpTwilio);


module.exports = router;