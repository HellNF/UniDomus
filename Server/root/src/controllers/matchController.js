// controllers/matchController.js

const MatchModel = require('../models/matchModel');
const UserModel = require('../models/userModel');
const { matchStatusEnum } = require('../models/enums');
const { sendMatchNotification } = require('../services/notificationService');

/**
 * Controller function for creating a match.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function createMatch(req, res) {
    const { requesterID, receiverID, matchType } = req.body;

    try {
        // Check if the requester and receiver are valid users
        const requester = await UserModel.findById(requesterID);
        const receiver = await UserModel.findById(receiverID);

        if (!requester || !receiver) {
            return res.status(404).json({ message: "One or both users not found" });
        }

        // Create a new match
        const newMatch = await MatchModel.create({
            requesterID,
            receiverID,
            matchType,
            matchStatus: matchStatusEnum.PENDING
        });

        // Optionally, send a notification about the new match
        await sendMatchNotification(receiver.email, 'You have a new match request!');

        return res.status(200).json({ message: "Match created successfully", match: newMatch });
    } catch (error) {
        console.error("Error creating match:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for retrieving matches by user ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getMatchesByUserID(req, res) {
    const { userID } = req.params;

    try {
        const matches = await MatchModel.find({
            $or: [{ requesterID: userID }, { receiverID: userID }]
        }).populate('requesterID receiverID');

        return res.status(200).json({ matches });
    } catch (error) {
        console.error("Error retrieving matches:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for retrieving matches received by a user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getReceivedMatches(req, res) {
    const { userID } = req.params;

    try {
        const matches = await MatchModel.find({ receiverID: userID }).populate('requesterID receiverID');

        return res.status(200).json({ matches });
    } catch (error) {
        console.error("Error retrieving received matches:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for retrieving matches sent by a user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getSentMatches(req, res) {
    const { userID } = req.params;

    try {
        const matches = await MatchModel.find({ requesterID: userID }).populate('requesterID receiverID');

        return res.status(200).json({ matches });
    } catch (error) {
        console.error("Error retrieving sent matches:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for updating match status.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function updateMatchStatus(req, res) {
    const { matchID } = req.params;
    const { matchStatus } = req.body;

    try {
        // Validate matchStatus
        if (!Object.values(matchStatusEnum).includes(matchStatus)) {
            return res.status(400).json({ message: "Invalid match status" });
        }

        // Find the match by ID
        const match = await MatchModel.findById(matchID);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // Update the match status and optionally set the confirmation date
        match.matchStatus = matchStatus;
        if (matchStatus === matchStatusEnum.CONFIRMED) {
            match.confirmationDate = new Date();
        }

        await match.save();

        return res.status(200).json({ message: `Match status updated to ${matchStatus}`, match });
    } catch (error) {
        console.error("Error updating match status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for adding a message to a match.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function addMessageToMatch(req, res) {
    const { matchID } = req.params;
    const { text, userID } = req.body;

    try {
        // Validate user
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the match and add the message
        const match = await MatchModel.findById(matchID);
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        match.messages.push({ text, userID });
        await match.save();

        return res.status(200).json({ message: "Message added successfully", match });
    } catch (error) {
        console.error("Error adding message to match:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function to delete a match by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function deleteMatchByID(req, res) {
    const { matchID } = req.params;

    try {
        // Find the match by ID and delete it
        const match = await MatchModel.findByIdAndDelete(matchID);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        return res.status(200).json({ message: "Match deleted successfully" });
    } catch (error) {
        console.error("Error deleting match:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function to get a match by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getMatchByID(req, res) {
    const { matchID } = req.params;

    try {
        // Find the match by ID
        const match = await MatchModel.findById(matchID).populate('requesterID receiverID');

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        return res.status(200).json({ match });
    } catch (error) {
        console.error("Error retrieving match:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for updating match details.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function updateMatchDetails(req, res) {
    const { matchID } = req.params;
    const updates = req.body;

    try {
        // Find the match by ID and update it with the new details
        const match = await MatchModel.findByIdAndUpdate(matchID, updates, { new: true });

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        return res.status(200).json({ message: "Match updated successfully", match });
    } catch (error) {
        console.error("Error updating match details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Export controller functions
module.exports = {
    createMatch,
    getMatchesByUserID,
    getReceivedMatches,
    getSentMatches,
    updateMatchStatus,
    addMessageToMatch,
    deleteMatchByID,
    getMatchByID,
    updateMatchDetails
};
