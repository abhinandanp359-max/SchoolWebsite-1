const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(v) {
        // Enforce strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    },
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  totpSecret: {
    type: String,
    select: false,
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
