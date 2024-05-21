const { reportTypeEnum, reportStatusEnum } = require('../models/enums');
const ReportModel = require('../models/reportModel');
const UserModel = require('../models/userModel');
const MatchModel = require('../models/matchModel');
const ListingModel = require('../models/listingModel');

/**
 * Validate the existence of the target entity based on the report type.
 * @param {string} reportType - The type of the report.
 * @param {string} targetID - The ID of the target.
 * @param {string} [messageID] - The ID of the message (optional, required if reportType is MESSAGE).
 * @returns {boolean} True if the target exists, otherwise false.
 */
async function validateTarget(reportType, targetID, messageID) {
    switch (reportType) {
        case reportTypeEnum.USER:
            return await UserModel.exists({ _id: targetID });
        case reportTypeEnum.LISTING:
            return await ListingModel.exists({ _id: targetID });
        case reportTypeEnum.MESSAGE:
            const match = await MatchModel.findById(targetID);
            return match && match.messages[messageID];
        case reportTypeEnum.MATCH:
            return await MatchModel.exists({ _id: targetID });
        default:
            return false;
    }
}

/**
 * Creates a new report.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.reporterID - The ID of the reporter.
 * @param {string} req.body.reportType - The type of the report.
 * @param {string} req.body.targetID - The ID of the target.
 * @param {string} req.body.description - The description of the report.
 * @param {string} req.body.messageID - The ID of the message (optional, required if reportType is MESSAGE).
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the created report or an error message.
 */
async function createReport(req, res) {
    const { reporterID, reportType, targetID, description, messageID } = req.body;

    
    try {
        // Validate reporter
        const reporter = await UserModel.findById(reporterID);
        if (!reporter) {
            return res.status(404).json({ message: "Reporter not found" });
        }

        const targetModelMap = {
            [reportTypeEnum.USER]: 'User',
            [reportTypeEnum.LISTING]: 'Listing',
            [reportTypeEnum.MATCH]: 'Match',
            [reportTypeEnum.MESSAGE]: 'Match'
        };

        const targetModel = targetModelMap[reportType];
        if (!targetModel) {
            return res.status(400).json({ message: "Invalid report type" });
        }

        // Validate target
        const targetExists = await validateTarget(reportType, targetID, messageID);
        if (!targetExists) {
            return res.status(404).json({ message: "Target not found" });
        }

        // Create report
        const newReport = await ReportModel.create({
            reporterID,
            reportType,
            targetID,
            targetModel,
            messageID: reportType === reportTypeEnum.MESSAGE ? messageID : undefined,
            description,
            reportStatus: reportStatusEnum.PENDING
        });

        return res.status(201).json({ message: "Report created successfully", report: newReport });
    } catch (error) {
        console.error("Error creating report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createReport
};
