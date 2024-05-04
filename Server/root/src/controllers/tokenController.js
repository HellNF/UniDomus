// controllers/tokenController.js

const Token = require('../models/tokenModel');
const User = require('../models/utentiModel');
const { isEmailSuccessfullyConfirmed } = require('../database/databaseQueries');

/**
 * Controller function for token confirmation.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function confirmToken(req, res) {
    const { token } = req.body;
    const userId = await isEmailSuccessfullyConfirmed(token);
    if (userId) {
        try {
            // Update the 'attivo' field in the 'utente' collection for the user with the given _id
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { attivo: true } },
                { new: true } // Return the modified document
            );

            if (updatedUser) {
                // If update is successful, remove the token from the 'tokens' collection
                const deletedToken = await Token.findOneAndDelete({ token });

                if (deletedToken) {
                    return res.status(200).json({ message: "success" });
                } else {
                    // If token deletion fails, return an error
                    return res.status(500).json({ message: "error", reason: "Failed to delete token" });
                }
            } else {
                // If user update fails, return an error
                return res.status(500).json({ message: "error", reason: "Failed to update user" });
            }
        } catch (error) {
            console.error("Error confirming token:", error);
            return res.status(500).json({ message: "error", reason: "Internal server error" });
        }
    } else {
        return res.status(400).json({ message: "error", reason: "Invalid token" });
    }
}

// Export controller functions
module.exports = {
    confirmToken
};
