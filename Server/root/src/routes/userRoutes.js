// Import necessary modules
const express = require('express');
const router = express.Router();
const { registerUser,authenticateUser } = require('../controllers/userController');


// Define routes for user registration
router.post('/registration', registerUser);

//Define routes for user authentication
router.post('/authentication', authenticateUser);


// Export router
module.exports = router;