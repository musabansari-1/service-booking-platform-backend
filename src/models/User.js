const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    // unique: true, // Optional: makes usernames unique
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['user', 'service_provider'], // Enum for valid types
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next(); // skip if unchanged
//   this.password = await bcrypt.hash(this.password, 10); // hash it
//   next();
// });

module.exports = mongoose.model('User', UserSchema);
