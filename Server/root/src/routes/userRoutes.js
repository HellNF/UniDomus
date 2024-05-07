// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { registerUser,authenticateUser,getTags, getUserById, updateUserById } = require('../controllers/userController');
router.use(bodyParser.urlencoded({ extended: false }));


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *           description: The username of the user.
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 30
 *           description: The name of the user.
 *         surname:
 *           type: string
 *           minLength: 2
 *           maxLength: 30
 *           description: The surname of the user.
 *         email:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           pattern: '^\S+@\S+\.\S+$'
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The hashed password of the user.
 *         birthDate:
 *           type: string
 *           format: date-time
 *           description: The birth date of the user.
 *         creationDate:
 *           type: string
 *           format: date-time
 *           description: The creation date of the user account.
 *         lastUpdate:
 *           type: string
 *           format: date-time
 *           description: The last update date of the user account.
 *         habits:
 *           type: array
 *           items:
 *             type: string
 *           description: The habits of the user.
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *           description: The hobbies of the user.
 *         proPic:
 *           type: array
 *           items:
 *             type: string
 *           description: The profile picture URLs of the user.
 *         activityStatus:
 *           type: string
 *           enum: [attivo, 'attivo recentemente', inattivo]
 *           description: The activity status of the user.
 *         active:
 *           type: boolean
 *           description: The activation status of the user account.
 *         listingID:
 *           type: string
 *           format: uuid
 *           description: The ID of the listing associated with the user.
 *         matchListID:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: The IDs of the matches associated with the user.
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
 * /api/users/registration:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - username
 *     responses:
 *       '200':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request or validation error.
 *       '500':
 *         description: Internal server error occurred.
 */
// Define routes for user registration
router.post('/registration', registerUser);


/**
 * @swagger
 * /api/users/authentication:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user with provided credentials and return an access token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User authenticated successfully and access token generated.
 *       '400':
 *         description: Bad request or validation error.
 *       '401':
 *         description: Unauthorized - Invalid credentials.
 *       '500':
 *         description: Internal server error occurred.
 */
//Define routes for user authentication
router.post('/authentication', authenticateUser);

router.get('/tags', getTags);

router.get('/:id', getUserById);

router.put('/:id', updateUserById);

// Export router
module.exports = router;