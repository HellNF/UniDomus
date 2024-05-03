const UserModel = require('../models/userModel');
const { isEmailValid, isStrongPassword, isUsernameValid } = require('../validators/validationFunctions');
const {isEmailAlreadyRegistered,isUsernameAlreadyTaken,isEmailPendingRegistration} = require('../database/databaseQueries');

/**
 * Controller function for user registration.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function registerUser(req, res) {
    const { email, password, username } = req.body;
    const errors = [];

    // Validate email
    if (!isEmailValid(email)) {
        errors.push({ field: "email", message: "Invalid email" });
    }

    // Validate password
    if (!isStrongPassword(password)) {
        errors.push({ field: "password", message: "Weak password" });
    }

    // Validate username
    if (!isUsernameValid(username)) {
        errors.push({ field: "username", message: "Invalid username" });
    }

    // Check if email is already registered
    const isEmailRegistered = await isEmailAlreadyRegistered(email);
    if (isEmailRegistered) {
        errors.push({ field: "email", message: "Email already registered" });
    }

    // Check if username is already taken
    const isUsernameTaken = await isUsernameAlreadyTaken(username);
    if (isUsernameTaken) {
        errors.push({ field: "username", message: "Username already taken" });
    }

    // Check if email is pending registration
    const isEmailPending = await isEmailPendingRegistration(email);
    if (isEmailPending) {
        errors.push({ field: "email", message: "Email pending registration" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "error", errors });
    }

    try {
        // Create user
        await UserModel.create({ email, password, username, attivo: false });

        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "error", reason: "Internal server error" });
    }
}

// Export controller functions
module.exports = {
    registerUser
};
