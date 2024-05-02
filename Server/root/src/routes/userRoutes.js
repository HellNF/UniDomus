// Import necessary modules
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// Define routes for user registration
router.post('/registrazione', registerUser);

// Export router
module.exports = router;