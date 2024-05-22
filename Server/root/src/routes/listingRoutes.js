const express = require('express');
const tokenChecker = require('../middleware/tokenChecker'); // Import the tokenChecker middleware
const router = express.Router();
const { listings, addListing, getListingById, addressToCoordinates,getCoordinatesById } = require('../controllers/listingController');

// Apply tokenChecker middleware to routes that require authentication
router.post('/', tokenChecker, addListing);

router.get('/', listings);
router.get('/coordinates', addressToCoordinates);
router.get('/coordinates/:id', getCoordinatesById);

router.get('/:id', getListingById);

module.exports = router;
