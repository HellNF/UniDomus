const mongoose = require('mongoose');

// schema per la collezione "listings"

const listingSchema = new mongoose.Schema({
  //oggetto indirizzo contenuto all'interno di linstings
  address: {
    street: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    city: {
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
      houseN: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5
      },
      province: {
        type: String,
        required: true,
        minlength: 2, //la provincia va indicata come diminutivo (Milano = MI)
        maxlength: 2
      },
    country: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
  },
  photos: {
    type: [String],
    validate: { // Verifica che l'array abbia al massimo 10 elementi
      validator: function(arr) {
        return arr.length <= 10;
      },
      message: props => `Too much element (foto)`
    }
  },
  publisherID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user' // Riferimento alla collezione "user"
  },
  tenantsID: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user' //Riferimento a "user"
    }],
    validate: {
      validator: function(arr) {// Verifica che l'array abbia massimo 12 elementi
        return arr.length <= 12;
      },
      message: props => `Too much element (idInquilini)`
    }
  },
  typology: {
    type: String,
    required: true,
    maxlength: 30 
  },
  description: {
    type: String,
    maxlength: 1000 
  },
  price: {
    type: Number,
    min: 10, 
    max: 10000 
  },
  floorArea: {
    type: Number,
    min: 1, 
    max: 10000 
  },
  availability: String, 
  publicationDate: {
    type: Date,
    default: () => Date.now()  + (2 * 60 * 60 * 1000),
    immutable: true
  }
});

// Creazione del modello "listings" basato sullo schema
const listing = mongoose.model('listing', listingSchema);

module.exports = listing;