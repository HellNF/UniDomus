// controllers/tokenController.js
require('dotenv').config({ path: '../../.env' });
const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const { isEmailSuccessfullyConfirmed } = require('../database/databaseQueries');

/**
 * Controller function for token confirmation.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function confirmToken(req, res) {
    const { token } = req.params; // Extract token from request parameters
    const userId = await isEmailSuccessfullyConfirmed(token);
    if (userId) {
        try {
            // Update the 'active' field in the 'utente' collection for the user with the given _id
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { active: true } },
                { new: true } // Return the modified document
            );

            if (updatedUser) {
                // If update is successful, remove the token from the 'tokens' collection
                const deletedToken = await Token.findOneAndDelete({ token });

                if (deletedToken) {
                    // Redirect to a success page if the token is confirmed and deleted
                    return res.redirect(`${process.env.FRONTEND_BASE}/login`);  // Change '/success-page-url' to the URL of your success page
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
        // If token is invalid or expired, return an appropriate error message
        if (!token) {
            return res.status(400).json({ message: "error", reason: "Token not provided" });
        } else {
            // Check if the token is expired
            const tokenEntry = await Token.findOne({ token });
            if (tokenEntry && tokenEntry.expirationDate < Date.now()) {
                return res.status(400).json({ message: "error", reason: "Expired token" });
            } else {
                return res.status(400).json({ message: "error", reason: "Invalid token" });
            }
        }
    }
}

// Export controller functions
module.exports = {
    confirmToken
};
