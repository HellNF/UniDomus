const mongoose = require('mongoose');
const { notificationTypeEnum, notificationStatusEnum, notificationPriorityEnum } = require('./enums');
const { sendNotificationEmail } = require('../services/emailService');  // Adjust the path as necessary
const UserModel = require('../models/userModel');  // Import the user model to fetch user email

const notificationSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(notificationTypeEnum),
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    status: {
        type: String,
        enum: Object.values(notificationStatusEnum),
        default: notificationStatusEnum.NOT_SEEN
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    link: {
        type: String, // URL or route related to the notification
        required: false
    },
    priority: {
        type: String,
        enum: notificationPriorityEnum,
        default: notificationPriorityEnum.LOW
    }
}, {
    timestamps: true
});

notificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Post-save middleware to send email
notificationSchema.post('save', async function(doc, next) {
    //i only want to send email notifications if the priority is high or medium
    if (doc.priority === notificationPriorityEnum.LOW) {
        return next();
    }
    try {
        const user = await UserModel.findById(doc.userID);
        if (user) {
            await sendNotificationEmail(user.email, doc.type, doc.message, doc.link);
            console.log(`Notification email sent to ${user.email}`);
        } else {
            console.error('User not found for notification:', doc.userID);
        }
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
    next();
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
