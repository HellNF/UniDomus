// controllers/userController.js

const { getDatabase } = require('../database/connection'); // Import the getDatabase function
const { UTENTE_COLLECTION_NAME } = require('../database/collectionNames');
const { isEmailValid, isStrongPassword, isUsernameValid } = require('../validators/validationFunctions');
const { isEmailAlreadyRegistered, isUsernameAlreadyTaken,isEmailPendingRegistration } = require('../database/databaseQueries');

/**
 * Controller function for user registration.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function registerUser(req, res) {
    const { email, password, username } = req.body;
    let validationResult = {
        message: "success",
        email: "valid",
        password: "valid",
        username: "valid",
        pending_registration: "no"
    };

    // Check email
    if (!isEmailValid(email)) {
        validationResult.email = "not valid";
    }

    // Check password
    if (!isStrongPassword(password)) {
        validationResult.password = "not valid";
    }

    // Check username
    if (!isUsernameValid(username)) {
        validationResult.username = "not valid";
    }

    // Check if email is already registered
    const isEmailRegistered = await isEmailAlreadyRegistered(email);
    if (isEmailRegistered) {
        validationResult.email = "already registered";
    }

    // Check if email is pending registration
    const isEmailPending = await isEmailPendingRegistration(email);
    if (isEmailPending) {
        validationResult.pending_registration = "yes";
    }

    // Check if username is already taken
    const isUsernameTaken = await isUsernameAlreadyTaken(username);
    if (isUsernameTaken) {
        validationResult.username = "already taken";
    }

    // Check if any validation failed
    const errors = Object.values(validationResult).filter(value => value === "not valid" || value === "already registered" || value === "not confirmed" || value === "already taken");
    if (errors.length > 0) {
        validationResult.message = "error";
        return res.status(400).json(validationResult);
    }

    try {
        // Insert user into the database
        const db = getDatabase(); // Get the database instance
        const utenteCollection = db.collection(UTENTE_COLLECTION_NAME); // Access the collection
        const result = await utenteCollection.insertOne({
            email,
            password,
            username,
            attivo: false // Set 'attivo' to false for new user
        });
        if (result.insertedId) {
            // Send success response after successful insertion
            return res.status(200).json(validationResult);
        } else {
            // Send error response if user insertion fails
            return res.status(500).json({ message: "error", reason: "Failed to insert user into database" });
        }
    } catch (error) {
        console.error("Error inserting user into database:", error);
        return res.status(500).json({ message: "error", reason: "Internal server error" });
    }
}

// Export controller functions
module.exports = {
    registerUser
};
