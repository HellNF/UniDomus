// controllers/userController.js

const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel'); // Import the Token model
const { isEmailValid, isStrongPassword, isUsernameValid } = require('../validators/validationFunctions');
const { isEmailAlreadyRegistered, isUsernameAlreadyTaken, isEmailPendingRegistration, isPasswordCorrect, getUserByEmail } = require('../database/databaseQueries');
const { generateRandomToken } = require('../utils/tokenUtils'); // Import the function to generate random token
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config() //to use environment variables
const { sendConfirmationEmail } = require('../services/emailService'); // Import the function to send confirmation email

/**
 * Controller function for user registration.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function registerUser(req, res) {
    const { email, password, username } = req.body;
    const errors = [];
    const nome = "nome";
    const cognome = "cognome";

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
        const newUser = await UserModel.create({ email, password, username,nome,cognome, attivo: false });

        // Generate random token
        const token = generateRandomToken(30);

        // Insert token into token collection
        await TokenModel.create({ token, userID: newUser._id });

        // Construct confirmation link
        const base_url = process.env.BASE_URL || "http://localhost:5050";
        const confirmationLink = `${base_url}/api/tokens/token/${token}`;

        // Send confirmation email
        await sendConfirmationEmail(email, confirmationLink);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "error", reason: "Internal server error" });
    }
}

/**
 * Controller function for user authentication.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function authenticateUser(req, res) {
    const { email, password} = req.body;

    //check if the email/password pair exists
    let user = await getUserByEmail(email);
    if (!user) return res.json({success:false,message:'User not found'})
    if (user.password!=password) return res.json({success:false,message:'Wrong password'})

    // user authenticated -> create a token
    var payload = { email: user.email, id: user._id }
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    return res.status(200).json({ success: true, message: 'Token returned',
        token: token, email: user.email, id: user._id, self: "api/users/authentication/" + user._id
    });
}

// Export controller functions
module.exports = {
    registerUser,
    authenticateUser
};
