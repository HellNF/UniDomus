const mongoose = require("mongoose")

// schema per la collezione "utenti"

const schemaUtenti = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    nome :{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30
    },
    cognome :{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30
    },
    email :{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        validate: {
          validator: function(v) {
              return /\S+@\S+\.\S+/.test(v); 
          },
          message: props => `${props.value} invalid email`
      }
    },
    password: {
        type: String,
        required: true,
        /*verifica che la password sia lunga almeno 8 caratteri, che ci sia almeno una 
        maiuscola, una minuscola ed un carattere speciale (@$!%*?&) */
        validate: { 
          validator: function(v) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
          },
          message: props => `${props.value}: invalid password`
        }
    },
    dataDiNascita:{
        type: Date,     
        validate: { //verifica che la data inserita non sia una data futura
            validator: function(date) {
                return date <= new Date() ;
            },
            message: props => `invalid date`
        }
    },
    dataCreazione:{
        type: Date,
        default: () => Date.now()  + (2 * 60 * 60 * 1000),
        mutable: false,
    },
    dataUltimoAggiornamento:{
      type: Date
    },
    abitudini: {
        type: [String],
        default: [],
        validate: { //verifica che l'array contenga massimo 20 elementi
          validator: function(arr) { 
            return arr.length <= 20;
          },
          message: props => `Too much elements (abitudini)`
        }
      },
      interessi: {
        type: [String],
        default: [],
        validate: { //verifica che l'array contenga massimo 20 elementi
          validator: function(arr) {
            return arr.length <= 20;
          },
          message: props => `Too much elements (interessi)`
        }
      },
      proPic: { //verifica che l'array contenga massimo 5 elementi
        type: [String],
        default: [],
        validate: {
          validator: function(arr) {
            return arr.length <= 5;
          },
          message: props => `Too much elements (proPic)`
        }
      },
      statoAttivita: {
        type: String,
        enum: ['attivo', 'attivo recentemente', 'inattivo'],
        default: 'attivo'
      },
      attivo:{
        type: Boolean,
        default: false
      },
      inserzioniID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inserzioni' //riferimento alla collezione "inserzioni"
      },
      listaMatchID: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'matches' //riferimento alla collezione "matches"
        }],
        default: []
      }
})

// Creazione del modello "utenti" basato sullo schema
const Utente = mongoose.model('utente', schemaUtenti, 'utenti');
module.exports = Utente;