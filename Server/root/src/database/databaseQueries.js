// Import the getDatabase function from connection.js
const { getDatabase } = require('./connection');

/**
 * Checks if the provided email address is already registered in the database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is already registered, otherwise false.
 */
async function isEmailAlreadyRegistered(email) {
    const db = getDatabase(); // Obtain the database instance
    const collection = db.collection('Utente'); // Access the collection
    const result = await collection.findOne({ email });
    return result !== null;
}

/**
 * Checks if the provided username is already taken.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is already taken, otherwise false.
 */
async function isUsernameAlreadyTaken(username) {
    const db = getDatabase(); // Obtain the database instance
    const collection = db.collection('Utente'); // Access the collection
    const result = await collection.findOne({ username });
    return result !== null;
}

/**
 * Checks if the provided email address is pending registration (not confirmed).
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is pending registration, otherwise false.
 */
async function isEmailPendingRegistration(email) {
    const db = getDatabase(); // Obtain the database instance
    const collection = db.collection('Utente'); // Access the collection
    const user = await collection.findOne({ email });
    return user && user.attivo === false;
}

/**
 * Checks if the provided token is valid and corresponds to a user ID in the database.
 * @param {string} token - The token to check.
 * @returns {Promise<string|null>} - A promise that resolves to the user ID if the token is valid, otherwise null.
 */
async function isEmailSuccessfullyConfirmed(token) {
    const db = getDatabase(); // Obtain the database instance
    const collection = db.collection('tokens'); // Access the token collection
    const result = await collection.findOne({ token });
    if (result) {
        return result.id; // Return the _id of the user
    }
    return null; // Return null if token is invalid
}

// Export database query functions
module.exports = {
    isEmailAlreadyRegistered,
    isUsernameAlreadyTaken,
    isEmailPendingRegistration,
    isEmailSuccessfullyConfirmed
};
