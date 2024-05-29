const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hobbiesEnum, habitsEnum, sexEnum, activeEnum } = require('./enums'); // Adjust the import according to your project structure

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false    
    },
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
        required: function() { return !this.googleId; },
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%-_.*?&])[A-Za-z\d$@!%-_.*?&]{8,}$/.test(v);
            },
            message: props => `${props.value}: invalid password`
        }
    },
    googleId: {
        type: String,
        default: null
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
        default: () => new Date(),
        immutable: true
    },
    lastUpdate: Date,
    gender: {
        type: String,
        enum: Object.values(sexEnum),
        default: sexEnum.OTHER
    },
    habits: {
        type: [String],
        enum: Object.values(habitsEnum),
        default: []
    },
    hobbies: {
        type: [String],
        enum: Object.values(hobbiesEnum),
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
        enum: Object.values(activeEnum),
        default: activeEnum.INACTIVE
    },
    active: {
        type: Boolean,
        default: false
    },
    housingSeeker: {
        type: Boolean,
        default: false
    },
    listingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    matchListID: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Match'
        }],
        default: []
    }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare provided password with stored hashed password
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
