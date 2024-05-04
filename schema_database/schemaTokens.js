const mongoose = require('mongoose');

// schema per la collezione "tokens"
const schemaTokens = new mongoose.Schema({
  idUtente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utenti', // Riferimento alla collezione degli utenti
    required: true
  },
  token: {
    type: String,
    required: true,
    minlength: 30,
    maxlength: 30
  },
  dataScadenza: {
    type: Date,
    default: function() {
      // Imposta la data di scadenza a un'ora dalla creazione del token
      return Date.now()  + (2 * 60 * 60 * 1000); 
    }
  }
});

// Creazione del modello "tokens" basato sullo schema
const Token = mongoose.model('tokens', schemaTokens);

module.exports = Token;