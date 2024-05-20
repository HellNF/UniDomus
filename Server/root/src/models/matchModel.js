const mongoose = require('mongoose');
const { matchStatusEnum, matchTypeEnum } = require('./enums'); // Changed import to require for consistency

// Schema for the "matches" collection
const matchSchema = new mongoose.Schema({
  requesterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the "user" collection
    required: true,
    index: true // Adding an index for performance
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the "user" collection
    required: true,
    index: true // Adding an index for performance
  },
  requestDate: {
    type: Date,
    default: () => new Date(Date.now() ),
    immutable: true // Making the field immutable
  },
  confirmationDate: {
    type: Date,
  },
  matchStatus: {
    type: String,
    enum: matchStatusEnum, // Possible values for match status
    default: matchStatusEnum.PENDING // Assuming the third enum is 'PENDING'
  },
  matchType: {
    type: String,
    enum: matchTypeEnum, // Possible match types
    required: true
  },
  messages: [{
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: () => new Date(Date.now()), 
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user' // Reference to the "user" collection
    }
  }]
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Middleware to set default values (if needed)
matchSchema.pre('save', function (next) {
  if (!this.requestDate) {
    this.requestDate = new Date(Date.now());
  }
  next();
});

// Creating the "matches" model based on the schema
const Match = mongoose.model('Match', matchSchema); // Changed model name to singular

module.exports = Match;
