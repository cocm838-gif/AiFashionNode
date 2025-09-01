const router = require('express').Router();
const userController = require('../controllers/userController');
const { validationSchemas } = require('../middleware');
const upload = require('../middleware/upload');

// Signup flow: send OTP if phone not registered
router.get('/me', userController.myProfile);

// Upload profile image
router.patch('/profile-image', upload.single('image'), userController.uploadProfileImage);

// Update profile details (name, bio, isPrivatePost)
router.patch('/profile', validationSchemas.updateProfileSchema, userController.updateProfile);


module.exports = router;