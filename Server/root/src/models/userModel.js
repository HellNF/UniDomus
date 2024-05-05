const mongoose = require("mongoose")

//scheme for the collection "users"

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
        /*verify that the password is at least 8 characters long, that there is at least one 
        uppercase, one lowercase and one special character (@$!%*?&)*/
        validate: { 
          validator: function(v) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
          },
          message: props => `${props.value}: invalid password`
        }
    },
    birthDate:{
        type: Date,     
        validate: { //verify that the date entered is not a future date
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
        validate: { //verify that the array contains up to 20 elements
          validator: function(arr) { 
            return arr.length <= 20;
          },
          message: props => `Too much elements (habits)`
        }
      },
      hobbies: {
        type: [String],
        default: [],
        validate: { //verify that the array contains up to 20 elements
          validator: function(arr) {
            return arr.length <= 20;
          },
          message: props => `Too much elements (hobbies)`
        }
      },
      proPic: { //verify that the array contains up to 5 elements
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
        ref: 'listings' //reference to the collection "listings"
      },
      matchListID: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'matches' //reference to the collection "matches"
        }],
        default: []
      }
})

// Creation of the "users" model based on the schema
const User = mongoose.model('user', userSchema);
module.exports = User;