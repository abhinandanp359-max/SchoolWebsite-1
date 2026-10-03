const express = require('express');
const router = express.Router();
const { login, logout, getMe, updateCredentials, generate2FA, verify2FA, disable2FA } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const { body, validationResult } = require('express-validator');

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn(`[SECURITY AUDIT] Validation failed at ${req.originalUrl}:`, errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/login', 
  loginLimiter, 
  [
    body('username').trim().escape().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-credentials', protect, 
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newUsername').optional().trim().escape(),
    body('newPassword').optional().trim(),
  ],
  validate,
  updateCredentials
);

// 2FA Routes
router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/verify', protect, [body('token').trim().isNumeric()], validate, verify2FA);
router.post('/2fa/disable', protect, [body('password').notEmpty()], validate, disable2FA);

module.exports = router;
