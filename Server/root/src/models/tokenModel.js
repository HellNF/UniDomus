// models/tokenModel.js

const mongoose = require('mongoose');

// Define the schema for the token collection
const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    idUtente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente', // Reference to the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Set expiration time to 1 hour (in seconds)
    }
});

// Create and export the Token model
module.exports = mongoose.model('Token', tokenSchema,'tokens');
