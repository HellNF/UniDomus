// userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  attivo: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
