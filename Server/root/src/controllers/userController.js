// controllers/userController.js

const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel'); // Import the Token model
const { isEmailValid, isStrongPassword, isUsernameValid } = require('../validators/validationFunctions');
const { isEmailAlreadyRegistered, isUsernameAlreadyTaken, isEmailPendingRegistration, isPasswordCorrect, getUserByEmail } = require('../database/databaseQueries');
const { generateRandomToken } = require('../utils/tokenUtils'); // Import the function to generate random token

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

        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "error", reason: "Internal server error" });
    }
}

async function authenticateUser(req, res) {
    const { email, password} = req.body;
    const errors = [];

    // Check if email is already registered
   /*const isEmailRegistered = await isEmailAlreadyRegistered(email);
    if (!isEmailRegistered) {
        //console.error("", error);
        return res.status(500).json({field: "email", message: "error", reason: "Email not found" });
    }
    const isPwdCorrect = await isPasswordCorrect(email,password);
    if(!isPwdCorrect){
        //console.error("", error);
        return res.status(500).json({field: "password", message: "error", reason: "Wrong password" });
    }*/

    let user = await getUserByEmail(email);
    if (!user) return res.json({success:false,message:'User not found'})
    if (user.password!=password) return res.json({success:false,message:'Wrong password'})

    // user authenticated -> create a token
    /*var payload = { email: user.email, id: user._id, other_data: encrypted_in_the_token }
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    res.json({ success: true, message: 'Enjoy your token!'
    ,
    token: token, email: user.email, id: user._id, self: "api/v1/" + user._id
    });*/

    return res.status(200).json({ message: "success" });
    
}

// Export controller functions
module.exports = {
    registerUser,
    authenticateUser
};
