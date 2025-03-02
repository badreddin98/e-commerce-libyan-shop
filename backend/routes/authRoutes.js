const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, makeAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/make-admin', protect, makeAdmin);

module.exports = router;
