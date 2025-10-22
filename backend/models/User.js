const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  heightCm: { type: Number, default: null },
  weightKg: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
