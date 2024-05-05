const mongoose = require('mongoose');

// schema per la collezione "tokens"
const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Riferimento alla collezione degli user
    required: true
  },
  token: {
    type: String,
    required: true,
    minlength: 30,
    maxlength: 30
  },
  expirationDate: {
    type: Date,
    default: function() {
      // Imposta la data di scadenza a un'ora dalla creazione del token
      return Date.now()  + (2 * 60 * 60 * 1000); 
    }
  }
});

// Creazione del modello "tokens" basato sullo schema
const Token = mongoose.model('tokens', tokenSchema);

module.exports = Token;