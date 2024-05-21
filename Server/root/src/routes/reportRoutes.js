const express = require('express');
const tokenChecker = require('../middleware/tokenChecker');

const { createReport } = require('../controllers/reportController');
const router = express.Router();

// Import the necessary controllers and middleware
router.use(tokenChecker);

// Define your routes
router.post('/', createReport);

module.exports = router;
