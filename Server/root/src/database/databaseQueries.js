const User = require('../models/userModel');
const Token = require('../models/tokenModel');

/**
 * Checks if the provided email address is already registered in the database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is already registered, otherwise false.
 */
async function isEmailAlreadyRegistered(email) {
    const user = await User.findOne({ email });
    return user !== null;
}

/**
 * Checks if the provided username is already taken.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is already taken, otherwise false.
 */
async function isUsernameAlreadyTaken(username) {
    const user = await User.findOne({ username });
    return user !== null;
}

/**
 * Checks if the provided email address is pending registration (not confirmed).
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is pending registration, otherwise false.
 */
async function isEmailPendingRegistration(email) {
    const user = await User.findOne({ email });
    return user && user.attivo === false;
}

/**
 * Checks if the provided token is valid and corresponds to a user ID in the database.
 * @param {string} token - The token to check.
 * @returns {Promise<string|null>} - A promise that resolves to the user ID if the token is valid, otherwise null.
 */
async function isEmailSuccessfullyConfirmed(token) {
    const tokenEntry = await Token.findOne({ token });
    if (tokenEntry) {
        return tokenEntry.idUtente.toString(); // Return the user ID as a string
    }
    return null; // Return null if token is invalid
}

/**
 * Checks if the provided password is correct for the provided email  
 * @param {string} password - The password  to check.
 * @param {string} email - The email associated with the password.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password exists, otherwise false.
 */
async function isPasswordCorrect(email,password) {
    const user = await User.findOne({ email,password });
    return user !== null;
}

/**
 * Returns the user whose email is provided   
 * @param {string} email - The user’s email to return.
 * @returns {Promise<object>} - A promise returns the user corresponding to the email provided.
 */
async function getUserByEmail(email) {
    let user = await User.findOne({ email: email }).exec()
    return user;
}



// Export database query functions
module.exports = {
    isEmailAlreadyRegistered,
    isUsernameAlreadyTaken,
    isEmailPendingRegistration,
    isEmailSuccessfullyConfirmed,
    isPasswordCorrect,
    getUserByEmail
};
