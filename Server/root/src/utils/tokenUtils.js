// utils.js

/**
 * Function to generate a random token.
 * @param {number} length - The length of the token.
 * @returns {string} - The generated token.
 */
function generateRandomToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

module.exports = {
    generateRandomToken
};
