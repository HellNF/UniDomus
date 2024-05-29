const { reportTypeEnum, reportStatusEnum } = require('../models/enums');
const ReportModel = require('../models/reportModel');
const UserModel = require('../models/userModel');
const MatchModel = require('../models/matchModel');
const ListingModel = require('../models/listingModel');
//const { report } = require('../routes/reportRoutes');

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
 * @param {string} req.body.messageID - The ID of the message (optional, only for reportType = 'MESSAGE').
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the status and the created report.
 */
async function createReport(req, res) {
    const { reporterID, reportType, targetID, description, messageID } = req.body;

    try {
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

        const targetExists = await validateTarget(reportType, targetID, messageID);
        if (!targetExists) {
            return res.status(404).json({ message: "Target not found" });
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
async function updateReportRemove(req, res) {

    const  _id  = req.body.reportID;
    console.log(_id);
    try {
        
        const updatedReport = await ReportModel.findByIdAndUpdate(_id,{
            reviewerID:null,
            reviewDate: null,
            reportStatus: reportStatusEnum.PENDING
        }, { new: true });
        console.log(updatedReport)
        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({ message: "Report updated successfully", report: updatedReport });
    } catch (error) {
        console.error("Error updating report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}
async function updateReportReview(req, res) {
    // const { reportID, reviewerID, reportStatus=reportStatusEnum.REVIEWING } = req.body;
    const reportID= req.body.reportID;
    const reviewerID= req.body.reviewerID;
    const reportStatus= req.body.reportStatus || reportStatusEnum.REVIEWING;
    console.log(reportID, reviewerID, reportStatus);

    
    try {
        const updatedReport = await ReportModel.findByIdAndUpdate(reportID, {
            reviewerID,
            reviewDate: new Date(),
            reportStatus
        }, { new: true });

        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({ message: "Report updated successfully", report: updatedReport });
    } catch (error) {
        console.error("Error updating report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function updateReportResolution(req, res) {
    const { reportID, reportStatus } = req.body;

    try {
        const updatedReport = await ReportModel.findByIdAndUpdate(reportID, {
            resolvedDate: new Date(),
            reportStatus
        }, { new: true });

        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        console.log("Report updated successfully");
        return res.status(200).json({ message: "Report updated successfully", report: updatedReport });
    } catch (error) {
        console.error("Error updating report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getPendingReports(req, res) {
    try {
        const pendingReports = await ReportModel.find({ reportStatus: reportStatusEnum.PENDING });
        return res.status(200).json({ reports: pendingReports });
    } catch (error) {
        console.error("Error retrieving pending reports:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getResolvedReports(req, res) {
    try {
        const resolvedReports = await ReportModel.find({ reportStatus: reportStatusEnum.RESOLVED });
        return res.status(200).json({ reports: resolvedReports });
    } catch (error) {
        console.error("Error retrieving resolved reports:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getReviewingReports(req, res) {
    const { adminID } = req.params;
    console.log(`Admin ID: ${adminID}`);
    console.log(`Expected report status: ${reportStatusEnum.REVIEWING}`);

    try {
        const query = {
            reportStatus: reportStatusEnum.REVIEWING, // Usa il valore enum corretto
            reviewerID: adminID
            
        };
        

        const reviewingReports = await ReportModel.find(query);
        //console.log(`Reviewing Reports: ${reviewingReports}`);
        
        return res.status(200).json({ reports: reviewingReports });
    } catch (error) {
        console.error("Error retrieving reviewing reports:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getReportsByReporter(req, res) {
    const { reporterID } = req.params;

    try {
        const reporterReports = await ReportModel.find({ reporterID });
        return res.status(200).json({ reports: reporterReports });
    } catch (error) {
        console.error("Error retrieving reporter's reports:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getReportsByTarget(req, res) {
    const { targetID } = req.params;

    try {
        const targetReports = await ReportModel.find({ targetID });
        return res.status(200).json({ reports: targetReports });
    } catch (error) {
        console.error("Error retrieving target's reports:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getSingleReportById(req, res) {
    const { id } = req.params;

    try {
        const report = await ReportModel.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({ report });
    } catch (error) {
        console.error("Error retrieving the report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createReport,
    updateReportReview,
    updateReportResolution,
    getPendingReports,
    getResolvedReports,
    getReviewingReports,
    getReportsByReporter,
    getReportsByTarget,
    getSingleReportById,
    updateReportRemove
};
