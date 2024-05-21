const { reportTypeEnum, reportStatusEnum } = require('./enums');
const ReportModel = require('../models/reportModel');
const UserModel = require('../models/userModel');
const MatchModel = require('../models/matchModel');

/**
 * Controller function for creating a report.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
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
            [reportTypeEnum.CONVERSATION]: 'Match',
            [reportTypeEnum.MESSAGE]: 'Match' // Matches will contain messages

        };

        const targetModel = targetModelMap[reportType];
        if (!targetModel) {
            return res.status(400).json({ message: "Invalid report type" });
        }

        // Validate messageID if reportType is MESSAGE
        if (reportType === reportTypeEnum.MESSAGE) {
            const match = await MatchModel.findById(targetID);
            if (!match) {
                return res.status(404).json({ message: "Match not found" });
            }
            if (!match.messages[messageID]) {
                return res.status(404).json({ message: "Message not found in the specified match" });
            }
        }

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
