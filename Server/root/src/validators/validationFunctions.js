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
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return !(username.length < 3 || username.length > 20) && !specialCharRegex.test(username);
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


// Export validation functions
module.exports = {
    isStrongPassword,
    isUsernameValid,
    isEmailValid,
};
