// routes/tokenRouter.js

// Import necessary modules
const express = require('express');
const router = express.Router();
const { confirmToken } = require('../controllers/tokenController');

// Define route for token confirmation
router.get('/token/:token', confirmToken); // Accept token as a parameter in the URL

// Export router
module.exports = router;
