// Import necessary modules
const express = require('express');
const router = express.Router();
const { confirmToken } = require('../controllers/tokenController'); // Corrected import

// Define routes for token confirmation
router.put('/token', confirmToken);

// Export router
module.exports = router;
