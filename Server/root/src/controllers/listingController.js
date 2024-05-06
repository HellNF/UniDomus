const Listing = require('../models/listingModel');

async function listings(req, res) {
    try {
        // Step 1: Parse query parameters
        let query = {};
        const { priceMin, priceMax, typology, city, floorAreaMin, floorAreaMax } = req.query;

        // Step 2: Construct the query object
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = Number(priceMin);
            if (priceMax) query.price.$lte = Number(priceMax);
        }
        if (floorAreaMin || floorAreaMax) {
            query.floorArea = {};
            if (floorAreaMin) query.floorArea.$gte = Number(floorAreaMin);
            if (floorAreaMax) query.floorArea.$lte = Number(floorAreaMax);
        }
        if (typology) {
            query.typology = typology;
        }
        if (city) {
            query['address.city'] = city;
        }

        // Step 3: Execute the query with filters
        const listings = await Listing.find(query);

        if (!listings.length) {
            console.log("Filtered query returned no listings.");
            return res.status(200).json({ listings: [] });
        }

        console.log("Filtered listings retrieved successfully.");
        return res.status(200).json({ listings: listings });
    } catch (error) {
        console.error("Error retrieving listings with filters:", error);
        return res.status(500).json({ message: "Error retrieving listings", error: error.message });
    }
}

module.exports = {
    listings
};