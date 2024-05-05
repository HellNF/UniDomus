const mongoose = require('mongoose');

//schema for the collection "tokens"
const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the user collection
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
      //Ensure that the expiration date is set to one hour after the token creation.
      return Date.now()  + (2 * 60 * 60 * 1000); 
    }
  }
});

// Creation of the "tokens" model based on the schema
const Token = mongoose.model('tokens', tokenSchema);

module.exports = Token;