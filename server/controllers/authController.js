const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

exports.login = async (req, res, next) => {
  try {
    let { username, password, totpToken } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    username = String(username).trim();
    password = String(password).trim();

    const admin = await Admin.findOne({ username }).select('+password +totpSecret');
    
    if (!admin || !(await admin.comparePassword(password))) {
      console.warn(`[SECURITY AUDIT] Failed login attempt for username: ${username} at ${new Date().toISOString()}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2FA Verification
    if (admin.isTwoFactorEnabled) {
      if (!totpToken) {
        return res.status(200).json({ success: true, require2FA: true, message: '2FA token required' });
      }
      
      const isTotpValid = speakeasy.totp.verify({
        secret: admin.totpSecret,
        encoding: 'base32',
        token: totpToken,
        window: 1 // Allow 30 seconds of drift
      });

      if (!isTotpValid) {
        console.warn(`[SECURITY AUDIT] Failed 2FA attempt for admin: ${username} at ${new Date().toISOString()}`);
        return res.status(401).json({ message: 'Invalid 2FA token' });
      }
    }

    console.info(`[SECURITY AUDIT] Successful login for admin: ${username} at ${new Date().toISOString()}`);

    const token = generateToken(admin._id);

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Hardened against CSRF
      maxAge: 60 * 60 * 1000, // 1 hour session expiry instead of 7 days
    });

    res.status(200).json({
      success: true,
      admin: { id: admin._id, username: admin.username, role: admin.role, isTwoFactorEnabled: admin.isTwoFactorEnabled },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  console.info(`[SECURITY AUDIT] Logout at ${new Date().toISOString()}`);
  res.status(200).json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: { id: req.admin._id, username: req.admin.username, role: req.admin.role, isTwoFactorEnabled: req.admin.isTwoFactorEnabled },
  });
};

exports.updateCredentials = async (req, res, next) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to make changes' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin || !(await admin.comparePassword(currentPassword))) {
      console.warn(`[SECURITY AUDIT] Failed credential update attempt by ${admin?.username} at ${new Date().toISOString()}`);
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    if (newUsername) admin.username = newUsername;
    if (newPassword) admin.password = newPassword;
    
    await admin.save();

    console.info(`[SECURITY AUDIT] Credentials updated for admin: ${admin.username} at ${new Date().toISOString()}`);
    res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }
    next(error);
  }
};

// 2FA Setup endpoints
exports.generate2FA = async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret({ name: 'Mount Carmel School Admin' });
    
    const admin = await Admin.findById(req.admin._id);
    admin.totpSecret = secret.base32;
    await admin.save();

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    console.info(`[SECURITY AUDIT] 2FA Setup initiated for admin: ${admin.username} at ${new Date().toISOString()}`);
    res.status(200).json({ success: true, qrCodeUrl, secret: secret.base32 });
  } catch (error) {
    next(error);
  }
};

exports.verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+totpSecret');

    const verified = speakeasy.totp.verify({
      secret: admin.totpSecret,
      encoding: 'base32',
      token: token,
      window: 1
    });

    if (verified) {
      admin.isTwoFactorEnabled = true;
      await admin.save();
      console.info(`[SECURITY AUDIT] 2FA Enabled successfully for admin: ${admin.username} at ${new Date().toISOString()}`);
      res.status(200).json({ success: true, message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

exports.disable2FA = async (req, res, next) => {
  try {
    const { password } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');

    if (!(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    admin.isTwoFactorEnabled = false;
    admin.totpSecret = undefined;
    await admin.save();

    console.info(`[SECURITY AUDIT] 2FA Disabled for admin: ${admin.username} at ${new Date().toISOString()}`);
    res.status(200).json({ success: true, message: '2FA disabled successfully' });
  } catch (error) {
    next(error);
  }
};
