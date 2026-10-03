const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    // 1. Strict CSRF Check (Origin/Referer)
    if (req.method !== 'GET' && process.env.NODE_ENV === 'production') {
      const origin = req.headers.origin || req.headers.referer;
      const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
      if (!origin || !origin.startsWith(allowedOrigin)) {
        console.warn(`[SECURITY AUDIT] CSRF Attempt blocked from origin: ${origin} at ${new Date().toISOString()}`);
        return res.status(403).json({ message: 'Forbidden: Invalid Origin' });
      }
    }

    // 2. Authentication
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);

    if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    next();
  } catch (error) {
    console.warn(`[SECURITY AUDIT] Invalid token attempt at ${new Date().toISOString()}`);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// 3. Role-Based Access Control (RBAC)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      console.warn(`[SECURITY AUDIT] Unauthorized role access attempt by ${req.admin?.username} at ${new Date().toISOString()}`);
      return res.status(403).json({ message: `Forbidden: Requires one of roles [${roles.join(', ')}]` });
    }
    next();
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
};

module.exports = { protect, authorize, generateToken };
