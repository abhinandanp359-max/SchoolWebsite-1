const express = require('express');
const router = express.Router();
const { login, logout, getMe, updateCredentials } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-credentials', protect, updateCredentials);

module.exports = router;
