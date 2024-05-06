// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { listings } = require('../controllers/listingController');
router.use(bodyParser.urlencoded({ extended: false }));



router.post('/listing', listings);


// Export router
module.exports = router;