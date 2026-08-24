const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: { id: req.admin._id, username: req.admin.username },
  });
};

exports.updateCredentials = async (req, res, next) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to make changes' });
    }
    if (!newUsername && !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide a new username or new password' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin || !(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    if (newUsername) admin.username = newUsername;
    if (newPassword) admin.password = newPassword;
    
    await admin.save();

    res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }
    next(error);
  }
};
