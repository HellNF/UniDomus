// controllers/userController.js

const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel'); // Import the Token model
const ListingModel = require('../models/listingModel'); // Import the Listing model
const { isEmailValid, isUsernameValid, isPasswordValid } = require('../validators/validationFunctions');
const { isEmailAlreadyRegistered, 
    isUsernameAlreadyTaken, 
    isEmailPendingRegistration, 
    isPasswordCorrect, 
    getUserByEmail } = require('../database/databaseQueries');
const { generateRandomToken } = require('../utils/tokenUtils'); // Import the function to generate random token
const { calculateDOBFromAge } = require('../utils/dateUtils');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config() //to use environment variables
const { sendConfirmationEmail,
    sendPasswordResetEmail,
    sendUserDeletedEmail,
    sendUserBannedEmail } = require('../services/emailService'); // Import the function to send confirmation email
const { hobbiesEnum, habitsEnum } = require('./../models/enums');
const { OAuth2Client } = require('google-auth-library');
const NotificationModel = require('../models/notificationModel');
const { notificationPriorityEnum} = require('../models/enums');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require('../models/userModel');


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
    if (!isPasswordValid(password)) {
        errors.push({ field: "password", message: "Invalid password" });
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
        const newUser = await UserModel.create({ email, password, username, active: false });

        // Generate random token
        const token = generateRandomToken(30);

        // Insert token into token collection
        await TokenModel.create({ token, userID: newUser._id });

        // Construct confirmation link
        const base_url = process.env.BASE_URL;
        const confirmationLink = `${base_url}/api/tokens/${token}`;

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
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await getUserByEmail(email);

        // If no user found, return error
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Validate the password
        const isPasswordValid = await user.isValidPassword(password);

        // If password is invalid, return error
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Wrong password' });
        }

        // user authenticated -> create a token
        var payload = { email: user.email, id: user._id ,username: user.username, isAdmin: user.isAdmin}

        var options = { expiresIn: 86400 } // expires in 24 hours

        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        return res.status(200).json({ success: true, 
            message: 'Token returned', 
            token: token, 
            email: user.email, 
            id: user._id,
            banTime: user.ban.banTime,
            banPermanently: user.ban.banPermanently, 
            self: "api/users/authentication/" + user._id });
    } catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getTags(req, res) {
    try {
        // Return the enums as they are
        res.status(200).json({
            hobbies: hobbiesEnum,
            habits: habitsEnum
        });
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Controller function for retrieving a user by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const { proPic } = req.query; // Extracting the proPic query parameter

        const user = await User.findById(id);

        if (!user) {
            console.log("User not found.");
            return res.status(400).json({ message: "User not found" });
        }

        // Handling the proPic query parameter
        if (proPic) {
            if (proPic.toLowerCase() === 'true') {
                // If proPic is true, return user with all proPics
            } else if (proPic.toLowerCase() === 'false') {
                // If proPic is false, remove the proPic field from the user object
                user.proPic = user.proPic.slice(0, 0);
            } else {
                let numberOfPics = parseInt(proPic); // Convert proPic to an integer
                if (!isNaN(numberOfPics) && numberOfPics >= 1 && numberOfPics <= 5) {
                    // Return the user with the specified number of proPics if present
                    user.proPic = user.proPic.slice(0, numberOfPics);
                }
            }
        } else {
            // If proPic query parameter is not defined, remove the entire proPic property from the user object
            user.proPic = user.proPic.slice(0, 0);
        }

        console.log("User retrieved successfully.");
        return res.status(200).json({ user: user });
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
}
/**
 *  Controller function for retrieving all users with the proPic filter.
 *  @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */

/**
 * Controller function for retrieving all users with optional proPic handling.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getAllUsers(req, res) {
    try {
        const { proPic } = req.query; // Extracting the proPic query parameter

        const users = await User.find({});

        if (!users || users.length === 0) {
            console.log("No users found.");
            return res.status(400).json({ message: "No users found" });
        }

        users.forEach(user => {
            // Handling the proPic query parameter
            if (proPic) {
                if (proPic.toLowerCase() === 'true') {
                    // If proPic is true, return user with all proPics
                } else if (proPic.toLowerCase() === 'false') {
                    // If proPic is false, remove the proPic field from the user object
                    user.proPic = user.proPic.slice(0, 0);
                } else {
                    let numberOfPics = parseInt(proPic); // Convert proPic to an integer
                    if (!isNaN(numberOfPics) && numberOfPics >= 1 && numberOfPics <= 5) {
                        // Return the user with the specified number of proPics if present
                        user.proPic = user.proPic.slice(0, numberOfPics);
                    }
                }
            } else {
                // If proPic query parameter is not defined, remove the entire proPic property from the user object
                user.proPic = user.proPic.slice(0, 0);
            }
        });

        console.log("Users retrieved successfully.");
        return res.status(200).json({ users: users });
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
}

    






/**
 * Controller function for updating user details.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - The Express response object.
 * @throws {Error} - If an error occurs while updating the user.
 * @throws {Error} - If the user is not found.
 * @throws {Error} - If an error occurs while updating the user.
 */
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { proPic } = req.query; // Extracting the proPic query parameter
        const updates = req.body;

        // Update the user document with all fields provided in the request body
        const user = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!user) {
            console.log("User not found.");
            return res.status(404).json({ message: "User not found" });
        }

         // Handling the proPic query parameter
         if (proPic) {
            if (proPic.toLowerCase() === 'true') {
                // If proPic is true, return user with all proPics
            } else if (proPic.toLowerCase() === 'false') {
                // If proPic is false, remove the proPic field from the user object
                user.proPic = user.proPic.slice(0, 0);
            } else {
                let numberOfPics = parseInt(proPic); // Convert proPic to an integer
                if (!isNaN(numberOfPics) && numberOfPics >= 1 && numberOfPics <= 5) {
                    // Return the user with the specified number of proPics if present
                    user.proPic = user.proPic.slice(0, numberOfPics);
                }
            }
        } else {
            // If proPic query parameter is not defined, remove the entire proPic property from the user object
            user.proPic = user.proPic.slice(0, 0);
        }

        console.log("User updated successfully.");
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Error updating user", error: error.message });
    }
};


/**
 * Controller function to delete a user by ID and their associated listing.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function deleteUserById(req, res) {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attempt to delete the associated listing if listingID exists
        if (user.listingID) {
            try {
                await ListingModel.findByIdAndDelete(user.listingID);
            } catch (listingError) {
                console.error("Error deleting listing:", listingError);
            }
        }

        // Delete the user
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(500).json({ message: "Error deleting user" });
        }

        await sendUserDeletedEmail(user.email);

        return res.status(200).json({ message: "User and associated listing (if any) deleted successfully" });
    } catch (error) {
        console.error("Error deleting user and listing:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}








async function requestPasswordChange(req, res) {
    console.log(req.body)
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If no user found, return error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a unique token for password reset
        const token = generateRandomToken(30);

        // Save the token in the database
        await TokenModel.create({ token, userID: user._id });

        // Construct password reset link
        const base_url = process.env.FRONTEND_BASE;

        const resetLink = `${base_url}/resetpassword/${token}`;

        // Send password reset email to the usesr
        await sendPasswordResetEmail(user.email, resetLink);

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error initiating password change:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



async function updatePassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      // Verify the token
      const tokenRecord = await TokenModel.findOne({ token });
  
      // If no token found, return error
      if (!tokenRecord) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }
  
      // Verify the token's expiration
      const tokenExpiration = new Date(tokenRecord.expiresAt);

      if (tokenExpiration < Date.now()) {
        // If token is expired, delete it from the database and return error
        await TokenModel.deleteOne({ token });
        return res.status(404).json({ message: 'Token expired' });
      }
  
      // Find the user associated with the token
      const user = await User.findById(tokenRecord.userID);
  
      // Update the user's password
      user.password = password;
      await user.save();
  
      // Delete the token record from the database
      await TokenModel.deleteOne({ token });
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  /**
 * Controller function to ban a user by ID for a specified duration or permanently.
 * Also bans the associated listing.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function banUserById(req, res) {
    try {
        const { id } = req.params;
        const { banTimeInSeconds, 
            banPermanently, 
            banMsg } = req.body;

        let userUpdateData = {};
        let listingUpdateData = {};
        let updatedListing = null;

        // Retrieve the user to check current ban details
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Increment prevBanNum
        const prevBanNum = user.ban.prevBanNum ? user.ban.prevBanNum + 1 : 1;

        if (banPermanently) {
            userUpdateData = {
                'ban.banPermanently': true,
                'ban.banTime': null,
                'ban.prevBanNum': prevBanNum,
                'ban.banMsg': banMsg // Add ban message for user
            };
            listingUpdateData = {
                'ban.banPermanently': true,
                'ban.banTime': null
            };
        } else {
            if (!banTimeInSeconds || isNaN(banTimeInSeconds) || banTimeInSeconds <= 0) {
                return res.status(400).json({ message: "Invalid ban time provided" });
            }

            console.log(`Banning user with ID: ${id} for ${banTimeInSeconds} seconds plus 2 hours`);

            // Calculate the ban expiration date by adding banTimeInSeconds and additional 2 hours (7200 seconds)
            const totalBanTimeInSeconds = banTimeInSeconds + 7200;
            const banExpirationDate = new Date(Date.now() + totalBanTimeInSeconds * 1000);

            console.log(`Calculated ban expiration date: ${banExpirationDate}`);

            userUpdateData = {
                'ban.banTime': banExpirationDate,
                'ban.banPermanently': false,
                'ban.prevBanNum': prevBanNum,
                'ban.banMsg': banMsg // Add ban message for user
            };
            listingUpdateData = {
                'ban.banTime': banExpirationDate,
                'ban.banPermanently': false
            };
        }

        // Update the user's ban details using findByIdAndUpdate
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: userUpdateData },
            { new: true, runValidators: true } // Ensure validators run
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send ban email to the user
        await sendUserBannedEmail(updatedUser.email, banTimeInSeconds, banPermanently, prevBanNum, banMsg);

        // Update the associated listing's ban details if listingID exists
        if (updatedUser.listingID) {
            updatedListing = await ListingModel.findByIdAndUpdate(
                updatedUser.listingID,
                { $set: listingUpdateData },
                { new: true, runValidators: true } // Ensure validators run
            );

            if (!updatedListing) {
                return res.status(404).json({ message: "Listing not found" });
            }
        }

        console.log(`User and associated listing updated successfully`);

        return res.status(200).json({ 
            message: "User and associated listing banned successfully", 
            userBan: updatedUser.ban, 
            listingBan: updatedListing ? updatedListing.ban : null 
        });
    } catch (error) {
        console.error("Error banning user and listing:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}



  /**
 * Controller function to get all banned users, both permanently and temporarily.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getBannedUsers(req, res) {
    try {
    
        const currentTime = new Date();
        const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); 
        const bannedUsers = await UserModel.find({
            $or: [
                { 'ban.banPermanently': true },
                { 'ban.banTime': { $gt: twoHoursLater } }
            ]
        });

        if (!bannedUsers || bannedUsers.length === 0) {
            console.log("No banned users found.");
            return res.status(200).json({ message: "No banned users found", users: [] });
        }

        console.log("Banned users retrieved successfully.");
        return res.status(200).json({ users: bannedUsers });
    } catch (error) {
        console.error("Error retrieving banned users:", error);
        return res.status(500).json({ message: "Error retrieving banned users", error: error.message });
    }
}



/**
 * Controller function to unban a user by ID.
 * Also unbans the associated listing if any.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function unbanUserById(req, res) {
    try {
        const { id } = req.params;
        const currentTime = new Date();
        const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

        // Find the user by ID
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is banned (permanently or temporarily)
        const isBanned = user.ban.banPermanently || (user.ban.banTime && user.ban.banTime > twoHoursLater);
        if (!isBanned) {
            return res.status(400).json({ message: "User is not banned" });
        }

        // Unban the user
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $unset: { 'ban.banTime': '', 'ban.banPermanently': '', 'ban.banMsg': '' } },
            { new: true }
        );

        // If the user has an associated listing, unban the listing
        let updatedListing = null;
        if (user.listingID) {
            updatedListing = await ListingModel.findByIdAndUpdate(
                user.listingID,
                { $unset: { 'ban.banTime': '', 'ban.banPermanently': '', 'ban.banMsg': '' } },
                { new: true }
            );
        }

        await NotificationModel.create({
            userID: user._id,
            type: "alert",
            message: `You have been recently unbanned`,
            link: `/`,
            priority: notificationPriorityEnum.MEDIUM
        });

        console.log(`User and associated listing unbanned successfully`);
        return res.status(200).json({
            message: "User and associated listing unbanned successfully"
        });
    } catch (error) {
        console.error("Error unbanning user and listing:", error);
        return res.status(500).json({ message: "Error unbanning user and listing", error: error.message });
    }
}



 /**
 * Controller function for retrieving housing seekers with filters, excluding banned users.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getHousingSeekers(req, res) {
    try {
        const { etaMin, etaMax, gender, hobbies, habits } = req.query;

        // If etaMin and etaMax are used, uncomment and adjust accordingly
        const dataMin = calculateDOBFromAge(parseInt(etaMax) + 1);
        const dataMax = calculateDOBFromAge(parseInt(etaMin));

        let query = {
            housingSeeker: true,
            birthDate: { $gte: dataMin, $lte: dataMax }
        };

        // Ensure gender is handled correctly whether it's a single value or an array
        if (gender) {
            if (Array.isArray(gender)) {
                query.gender = { $in: gender };
            } else {
                query.gender = gender;
            }
        }

        if (hobbies && hobbies.length > 0) {
            query.hobbies = { $all: hobbies };
        }

        if (habits && habits.length > 0) {
            query.habits = { $all: habits };
        }

        // Exclude banned users
        const currentTime = new Date();
        const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); 
        query.$and = [
            {
                $or: [
                    { 'ban.banPermanently': { $ne: true } },
                    { 'ban.banPermanently': { $exists: false } }
                ]
            },
            {
                $or: [
                    { 'ban.banTime': { $lte: twoHoursLater } },
                    { 'ban.banTime': { $exists: false } }
                ]
            }
        ];

        const users = await User.find(query);

        console.log("Housing seekers retrieved successfully.");
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error retrieving housing seekers:", error);
        return res.status(500).json({ message: "Error retrieving housing seekers", error: error.message });
    }
}

async function googleLogin(req, res) {
    try {
        const { token } = req.body;

        // Verifica il token ID di Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, picture, sub: googleId, given_name: name, family_name: surname } = payload;

        // Cerca l'utente per email
        let user = await User.findOne({ email });

        if (user) {
            // Se l'utente esiste ma non ha googleId, aggiorna il googleId
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Se l'utente non esiste, creane uno nuovo
            const username = email.split('@')[0];
            user = new User({
                googleId,
                email,
                username,
                name,
                surname,
                proPic: [picture],
                active: true,
            });
            await user.save();
        }

        // Genera un JWT per l'utente
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
        }, process.env.SUPER_SECRET, { expiresIn: '4h' });

        // Invia il JWT all'utente
        return res.status(200).json({ token: userJwt,
            banTime: user.ban.banTime,
            banPermanently: user.ban.banPermanently });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getUsersByUsername(req, res) {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: "Il parametro di query 'username' è obbligatorio" });
        }

        // Utilizza la proiezione per includere solo i campi specifici e il primo elemento di proPic
        const users = await User.find(
            { username: { $regex: username, $options: 'i' } })
                                .select('username proPic')
                                .lean();

        // Modifica ogni utente per includere solo il primo elemento di proPic
        const modifiedUsers = users.map(user => ({
            ...user,
            proPic: user.proPic && user.proPic.length > 0 ? user.proPic[0] : null
        }));

        console.log("Utenti recuperati con successo.");
        return res.status(200).json({ users: modifiedUsers });
    } catch (error) {
        console.error("Errore nel recupero degli utenti:", error);
        return res.status(500).json({ message: "Errore nel recupero degli utenti", error: error.message });
    }
}
  

// Export controller functions
module.exports = {
    registerUser,
    authenticateUser,
    getHousingSeekers,
    getTags,
    getUserById,
    updateUserById,
    updatePassword,
    requestPasswordChange,
    getAllUsers,
    googleLogin,
    getUsersByUsername,
    deleteUserById,
    banUserById,
    getBannedUsers,
    unbanUserById
};

