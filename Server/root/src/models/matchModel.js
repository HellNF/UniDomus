const mongoose = require('mongoose');

// schema per la collezione "matches"

const matchSchema = new mongoose.Schema({
  requesterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Riferimento alla collezione "user"
    required: true
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Riferimento alla collezione "user"
    required: true
  },
  requestDate: {
    type: Date,
    default: () => Date.now()  + (2 * 60 * 60 * 1000),
    mutable: false
  },
  confirmationDate: {
    type: Date,
  },
  matchState: {
    type: String,
    enum: ['in attesa', 'accettato', 'rifiutato'], // Possibili valori per lo stato del match
    default: 'in attesa'
  },
  matchType: {
    type: String,
    enum: ['match inquilino', 'match appartamento'], // Possibili tipi di match
    required: true
  },
  messages: [{
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: () => Date.now()  + (2 * 60 * 60 * 1000),
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user' // Riferimento alla collezione "user"
    }
  }]
});

// Creazione del modello "matches" basato sullo schema
const Match = mongoose.model('matches', matchSchema);

module.exports = Match;