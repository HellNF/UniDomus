// controllers/matchController.js

const MatchModel = require('../models/matchModel');
const UserModel = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');
const { matchStatusEnum , matchPriorityEnum, notificationPriorityEnum, notificationTypeEnum} = require('../models/enums');
/**
 * Controller function for creating a match.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function createMatch(req, res) {
    const { requesterID, receiverID, matchType } = req.body;

    try {
        // Check if the requester and receiver are valid users
        const [requester, receiver] = await Promise.all([
            UserModel.findById(requesterID),
            UserModel.findById(receiverID)
        ]);

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

        // Create a notification for the receiver
        await NotificationModel.create({
            userID: receiverID,
            type: "match",
            message: `You have a new match request from ${requester.name} ${requester.surname}`,
            link: `/matches/${newMatch._id}`,
            priority: notificationPriorityEnum.MEDIUM
        });

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
        });
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
        const matches = await MatchModel.find({ receiverID: userID });

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
        const matches = await MatchModel.find({ requesterID: userID });

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
    
    
    //log request
    console.log("Request to add message to match: ", req.body);

    try {
        //messages can only be added if the match is confirmed

        const match = await MatchModel.findById(matchID);
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        if (match.matchStatus !== matchStatusEnum.ACCEPTED) {
            return res.status(400).json({ message: "Messages can only be added to confirmed matches" });
        }
        // Validate user
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // add the message

        match.messages.push({ text, userID });
        await match.save();

        //create a notification for the other user
        const otherUserID = match.requesterID === userID ? match.receiverID : match.requesterID;
        await NotificationModel.create({
            userID: otherUserID,
            type: notificationTypeEnum.MESSAGE,
            message: `You have a new message from ${user.username}`,
            link: `/chat/${match._id}`,
            priority: notificationPriorityEnum.LOW
        });

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
        const match = await MatchModel.findById(matchID);

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

/**
 * Controller function for retrieving all messages in a match.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getMessagesByMatchID(req, res) {
    const { matchID } = req.params;

    try {
        // Find the match by ID
        const match = await MatchModel.findById(matchID);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        return res.status(200).json({ messages: match.messages });
    } catch (error) {
        console.error("Error retrieving messages:", error);
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
    updateMatchDetails,
    getMessagesByMatchID
};
