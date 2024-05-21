const mongoose = require('mongoose');
const { reportTypeEnum, reportStatusEnum } = require('./enums'); 

const reportSchema = new mongoose.Schema({
    reporterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reportType: {
        type: String,
        enum: Object.values(reportTypeEnum),
        required: true
    },
    reportStatus: {
        type: String,
        enum: Object.values(reportStatusEnum),
        default: reportStatusEnum.PENDING
    },
    reportDate: {
        type: Date,
        default: () => new Date(),
        immutable: true
    },
    reviewedDate: Date,
    resolvedDate: Date,
    targetID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reportType'
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
