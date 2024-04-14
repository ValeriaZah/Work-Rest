const express = require('express');
const { register, login, getUserDetails, updateUserSubscription, logout } = require('../controllers/userController');
const { protect } = require('../authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserDetails);
router.post('/updateSubscription', protect, updateUserSubscription);
router.post('/logout', protect, logout);

module.exports = router;
