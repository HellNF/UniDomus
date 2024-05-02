const { getDatabase } = require('../database/connection');
const { isEmailSuccessfullyConfirmed } = require('../database/databaseQueries');
const { UTENTE_COLLECTION_NAME, TOKEN_COLLECTION_NAME } = require('../database/collectionNames');

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
            const db = getDatabase(); // Get the database instance
            const utenteCollection = db.collection(UTENTE_COLLECTION_NAME); // Access the collection
            const tokenCollection = db.collection(TOKEN_COLLECTION_NAME); // Access the token collection

            // Update 'attivo' field to true
            const result = await utenteCollection.updateOne(
                { _id: userId }, // Filter by _id
                { $set: { attivo: true } } // Update 'attivo' field to true
            );

            if (result.modifiedCount > 0) {
                // If update is successful, remove the token from the 'tokens' collection
                const tokenDeleteResult = await tokenCollection.deleteOne({ token });

                if (tokenDeleteResult.deletedCount > 0) {
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
