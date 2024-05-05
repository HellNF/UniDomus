// Import necessary modules
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// Define routes for user registration
router.post('/registration', registerUser);

//Define routes for user login


// Export router
module.exports = router;