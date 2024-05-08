const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { hobbiesEnum, habitsEnum } = require('./enums');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    name: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    surname: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} invalid email`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%-_.*?&])[A-Za-z\d$@!%-_.*?&]{8,}$/.test(v);
            },
            message: props => `${props.value}: invalid password`
        }
    },
    birthDate: {
        type: Date,
        validate: {
            validator: function (date) {
                return date <= new Date();
            },
            message: props => `invalid date`
        }
    },
    creationDate: {
        type: Date,
        default: () => Date.now() + (2 * 60 * 60 * 1000),
        mutable: false,
    },
    lastUpdate: {
        type: Date
    },
    habits: {

        type: [String], 
        enum: habitsEnum,
        default: [] 
    },
    hobbies: {
        type: [String], 
        enum: hobbiesEnum,
        default: [] 

    },
    proPic: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                return arr.length <= 5;
            },
            message: props => `Too many elements (proPic)`
        }
    },
    activityStatus: {
        type: String,
        enum: ['attivo', 'attivo recentemente', 'inattivo'],
        default: 'attivo'
    },
    active: {
        type: Boolean,
        default: false
    },
    listingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'listings'
    },
    matchListID: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'matches'
        }],
        default: []
    }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it's new or modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt with a cost factor of 10
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Replace the plain-text password with the hashed password
        this.password = hashedPassword;

        // Call next to continue saving the user
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare provided password with stored hashed password
userSchema.methods.isValidPassword = async function (password) {
  try {
      // Use bcrypt to compare the provided password with the hashed password stored in the database
      return await bcrypt.compare(password, this.password);
  } catch (error) {
      throw new Error(error);
  }
};

// Create your UserModel
const User = mongoose.model('User', userSchema);
module.exports = User;