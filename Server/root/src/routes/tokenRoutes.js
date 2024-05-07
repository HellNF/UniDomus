// Import necessary modules
const express = require('express');
const router = express.Router();
const { confirmToken } = require('../controllers/tokenController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         userID:
 *           type: string
 *           format: uuid
 *           description: The ID of the user associated with the token.
 *         token:
 *           type: string
 *           minLength: 30
 *           maxLength: 30
 *           description: The token string for confirmation.
 *         expirationDate:
 *           type: string
 *           format: date-time
 *           description: The expiration date of the token.
 */

/**
 * @swagger
 * /api/token/token/{token}:
 *   get:
 *     summary: Confirm token and activate user account
 *     description: Confirm the token sent to the user's email and activate the user's account.
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token sent to the user's email for account activation.
 *     responses:
 *       '200':
 *         description: Token confirmed and user account activated successfully.
 *       '400':
 *         description: Invalid or expired token.
 *       '500':
 *         description: Internal server error occurred.
 */

// Define route for token confirmation
router.get('/token/:token', confirmToken); // Accept token as a parameter in the URL

// Export router
module.exports = router;
