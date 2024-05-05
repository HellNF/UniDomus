const mongoose = require("mongoose")

// schema per la collezione "utenti"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    name :{
        type: String,
        minLength: 2,
        maxLength: 30
    },
    surname :{
        type: String,
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
    birthDate:{
        type: Date,     
        validate: { //verifica che la data inserita non sia una data futura
            validator: function(date) {
                return date <= new Date() ;
            },
            message: props => `invalid date`
        }
    },
    creationDate:{
        type: Date,
        default: () => Date.now()  + (2 * 60 * 60 * 1000),
        mutable: false,
    },
    lastUpdate:{
      type: Date
    },
    habits: {
        type: [String],
        default: [],
        validate: { //verifica che l'array contenga massimo 20 elementi
          validator: function(arr) { 
            return arr.length <= 20;
          },
          message: props => `Too much elements (habits)`
        }
      },
      hobbies: {
        type: [String],
        default: [],
        validate: { //verifica che l'array contenga massimo 20 elementi
          validator: function(arr) {
            return arr.length <= 20;
          },
          message: props => `Too much elements (hobbies)`
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
      activityStatus: {
        type: String,
        enum: ['attivo', 'attivo recentemente', 'inattivo'],
        default: 'attivo'
      },
      active:{
        type: Boolean,
        default: false
      },
      listingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'listings' //riferimento alla collezione "inserzioni"
      },
      matchListID: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'matches' //riferimento alla collezione "matches"
        }],
        default: []
      }
})

// Creazione del modello "utenti" basato sullo schema
const User = mongoose.model('user', userSchema);
module.exports = User;