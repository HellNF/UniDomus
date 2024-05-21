const mongoose = require('mongoose');
const { matchStatusEnum, matchTypeEnum } = require('./enums'); // Adjust the import according to your project structure

const matchSchema = new mongoose.Schema({
    requesterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Use consistent naming conventions
        required: true,
        index: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    requestDate: {
        type: Date,
        default: () => new Date(),
        immutable: true
    },
    confirmationDate: Date,
    matchStatus: {
        type: String,
        enum: Object.values(matchStatusEnum), // Ensure enum values are used correctly
        default: matchStatusEnum.PENDING
    },
    matchType: {
        type: String,
        enum: Object.values(matchTypeEnum),
        required: true
    },
    messages: [{
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: () => new Date()
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
