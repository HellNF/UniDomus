const express = require('express');
const tokenChecker = require('../middleware/tokenChecker'); // Import the tokenChecker middleware
const router = express.Router();
const { listings, 
    addListing, 
    getListingById, 
    addressToCoordinates,
    getCoordinatesById,
    updateListingById,
    deleteListingById,
    banListingById,
    unbanListingById 
} = require('../controllers/listingController');

// Apply tokenChecker middleware to routes that require authentication
router.post('/', tokenChecker, addListing);

router.put('/:id',updateListingById);

router.put('/:id/ban',tokenChecker,banListingById);

router.put('/:id/unban',tokenChecker,unbanListingById);

router.delete('/:id',tokenChecker,deleteListingById);

router.get('/', listings);
router.get('/coordinates', addressToCoordinates);
router.get('/coordinates/:id', getCoordinatesById);

router.get('/:id', getListingById);

module.exports = router;
