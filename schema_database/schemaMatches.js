const mongoose = require('mongoose');

// schema per la collezione "matches"

const schemaMatches = new mongoose.Schema({
  idRichiedente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utenti', // Riferimento alla collezione "utenti"
    required: true
  },
  idRicevente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utenti', // Riferimento alla collezione "utenti"
    required: true
  },
  dataRichiesta: {
    type: Date,
    default: () => Date.now()  + (2 * 60 * 60 * 1000),
    mutable: false
  },
  dataConferma: {
    type: Date,
  },
  statoMatch: {
    type: String,
    enum: ['in attesa', 'accettato', 'rifiutato'], // Possibili valori per lo stato del match
    default: 'in attesa'
  },
  tipoMatch: {
    type: String,
    enum: ['match inquilino', 'match appartamento'], // Possibili tipi di match
    required: true
  },
  messaggi: [{
    testo: {
      type: String,
      required: true
    },
    data: {
      type: Date,
      default: () => Date.now()  + (2 * 60 * 60 * 1000),
    },
    idUtente: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'utenti' // Riferimento alla collezione "utenti"
    }
  }]
});

// Creazione del modello "matches" basato sullo schema
const Match = mongoose.model('matches', schemaMatches);

module.exports = Match;