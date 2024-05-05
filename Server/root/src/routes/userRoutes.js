// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { registerUser,authenticateUser } = require('../controllers/userController');
router.use(bodyParser.urlencoded({ extended: false }));


// Define routes for user registration
router.post('/registration', registerUser);

//Define routes for user authentication
router.post('/authentication', authenticateUser);


// Export router
module.exports = router;