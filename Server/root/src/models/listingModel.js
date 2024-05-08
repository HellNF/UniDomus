const mongoose = require('mongoose');

// schema for the collection "listings"

const listingSchema = new mongoose.Schema({
  //object address contained within linstings
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
        validate: { //verify that the CAP contains only digits
          validator: function(v) {
            return /^\d{5}$/.test(v); 
          },
          message: props => `${props.value} invalid CAP.`
        }
      },
      houseNum: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5
      },
      province: {
        type: String,
        required: true,
        minlength: 2, //the province should be indicated as diminutive (Milan = MI)
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
    validate: { // Ensure that the array contains up to 10 items
      validator: function(arr) {
        return arr.length <= 10;
      },
      message: props => `Too much element (photos)`
    }
  },
  publisherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' // Reference to the collection "user"
  },
  tenantsID: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user' //Reference to the collection "user"
    }],
    validate: {
      validator: function(arr) {// Ensure that the array contains up to 12 items
        return arr.length <= 12;
      },
      message: props => `Too much element (tenantsID)`
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
    required:true,
    min: 10, 
    max: 10000 
  },
  floorArea: {
    type: Number,
    min: 1, 
    max: 10000 
  },
  availability: {
    type: String,
    maxLength: 250
  },
  publicationDate: {
    type: Date,
    default: () => Date.now()  + (2 * 60 * 60 * 1000),
    immutable: true
  }
});

// Creazione del modello "listings" basato sullo schema
const listing = mongoose.model('listing', listingSchema);

module.exports = listing;