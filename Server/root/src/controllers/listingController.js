// listingController.js

const Listing = require('../models/listingModel');

/**
 * Controller for retrieving list of listings
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function listings(req, res) {
    try {
        // Fetch all listings from the database
        const allListings = await Listing.find();

        // If no listings found, return an empty array
        if (!allListings || allListings.length === 0) {
            return res.status(404).json({ message: "No listings found" });
        }

        // Return the list of listings
        return res.status(200).json({ listings: allListings });
    } catch (error) {
        console.error("Error retrieving listings:", error);
        return res.status(500).json({ message: "Error retrieving listings", error: error.message });
    }
}

// Export controller functions
module.exports = {
    listings
};
