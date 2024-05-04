const mongoose = require('mongoose');

// schema per la collezione "Inserzioni"

const schemaInserzioni = new mongoose.Schema({
  //oggetto indirizzo contenuto all'interno di inserzioni
  indirizzo: {
    via: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    citta: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
      },  
      cap: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5,
        validate: { //verifica che il CAP contenga solo cifre
          validator: function(v) {
            return /^\d{5}$/.test(v); 
          },
          message: props => `${props.value} invalid CAP.`
        }
      },
      numCivico: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5
      },
      provincia: {
        type: String,
        required: true,
        minlength: 2, //la provincia va indicata come diminutivo (Milano = MI)
        maxlength: 2
      },
    stato: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
  },
  foto: {
    type: [String],
    validate: { // Verifica che l'array abbia al massimo 10 elementi
      validator: function(arr) {
        return arr.length <= 10;
      },
      message: props => `Too much element (foto)`
    }
  },
  idInserzionista: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'utenti' // Riferimento alla collezione "Utenti"
  },
  idInquilini: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'utenti' //Riferimento a utenti
    }],
    validate: {
      validator: function(arr) {// Verifica che l'array abbia massimo 12 elementi
        return arr.length <= 12;
      },
      message: props => `Too much element (idInquilini)`
    }
  },
  tipologia: {
    type: String,
    required: true,
    maxlength: 30 
  },
  descrizione: {
    type: String,
    maxlength: 1000 
  },
  prezzo: {
    type: Number,
    min: 10, 
    max: 10000 
  },
  metratura: {
    type: Number,
    min: 1, 
    max: 10000 
  },
  disponibilita: String, 
  dataPubblicazione: {
    type: Date,
    default: () => Date.now()  + (2 * 60 * 60 * 1000),
    immutable: true
  }
});

// Creazione del modello "Inserzioni" basato sullo schema
const Inserzione = mongoose.model('inserzione', schemaInserzioni,'inserzioni');

module.exports = Inserzione;