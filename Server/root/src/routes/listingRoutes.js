// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const tokenChecker= require('../middleware/tokenChecker')
const router = express.Router();
const { listings, addListing , getListingById, addressToCordinates } = require('../controllers/listingController');

//router.use(bodyParser.urlencoded({ extended: false }));

const Listing = require('../models/listingModel');


router.get('/',listings);

router.post('/add',addListing);

router.get('/coordinates',addressToCordinates);

router.get('/:id',getListingById);





// Export router
module.exports = router;