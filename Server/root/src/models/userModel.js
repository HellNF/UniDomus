// validators/validationFunctions.js

/**
 * Validates if the provided password meets the criteria for a strong password.
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password meets all criteria, otherwise false.
 */
function isStrongPassword(password) {
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    return password.length >= 8 && digitRegex.test(password) && specialCharRegex.test(password) && lowerCaseRegex.test(password) && upperCaseRegex.test(password);
}

/**
 * Checks if the provided username is valid.
 * @param {string} username - The username to check.
 * @returns {boolean} - True if the username is valid, otherwise false.
 */
function isUsernameValid(username) {
    return !(username.length < 3 || username.length > 20);
}

/**
 * Validates if the provided email address is in a valid format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, otherwise false.
 */
function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Checks if the provided email address is already registered in the database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is already registered, otherwise false.
 */
async function isEmailAlreadyRegistered(email) {
    // Placeholder for checking if email is already registered in the database
    // You can implement the actual logic to check if the email exists in the database
    return false;
}

/**
 * Checks if the provided email address is pending registration (not confirmed).
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is pending registration, otherwise false.
 */
async function isEmailPendingRegistration(email) {
    // Placeholder for checking if email is pending registration
    // You can implement the actual logic to check if the email is pending registration
    return false;
}

/**
 * Checks if the provided username is already taken.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is already taken, otherwise false.
 */
async function isUsernameAlreadyTaken(username) {
    // Placeholder for checking if username is already taken
    // You can implement the actual logic to check if the username exists in the database
    return false;
}

// Export validation functions
module.exports = {
    isStrongPassword,
    isUsernameValid,
    isEmailValid,
    isEmailAlreadyRegistered,
    isEmailPendingRegistration,
    isUsernameAlreadyTaken
};
