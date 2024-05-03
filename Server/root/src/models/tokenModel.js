// tokenModel.js

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    idUtente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente', // Reference to the User model
        required: true
    }
});

module.exports = mongoose.model('Token', tokenSchema, 'tokens');
