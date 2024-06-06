const { log } = require('console');
const Listing = require('../models/listingModel');
require('dotenv').config({ path: '../../.env' });
const User = require('../models/userModel');
const { query } = require('express');
const NotificationModel = require('../models/notificationModel'); 
const { notificationPriorityEnum} = require('../models/enums');
const { convertSecondsToDHMS } = require('../utils/dateUtils');
const jwt = require('jsonwebtoken'); // Make sure to include the jwt package

/**
 * Controller function for retrieving listings with filters.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function listings(req, res) {
    try {
        // Step 1: Parse query parameters
        let query = {};
        const { priceMin, priceMax, typology, city, floorAreaMin, floorAreaMax } = req.query;

        // Step 2: Construct the query object
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) 
                query.price.$gte = Number(priceMin);
            if (priceMax) 
                query.price.$lte = Number(priceMax);
        }
        if (floorAreaMin || floorAreaMax) {
            query.floorArea = {};
            if (floorAreaMin) 
                query.floorArea.$gte = Number(floorAreaMin);
            if (floorAreaMax) 
                query.floorArea.$lte = Number(floorAreaMax);
        }
        if (typology) {
            query.typology = typology;
        }
        if (city) {
            query['address.city'] = city;
        }

        let isAdmin = false;
        // Check if the user is authenticated
        const token = req.headers['x-access-token'];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SUPER_SECRET);
                req.loggedUser = decoded;
                isAdmin = req.loggedUser.isAdmin;
            } catch (err) {
                console.error("Failed to authenticate token:", err);
                // If token verification fails, continue without isAdmin privileges
            }
        } else {
            console.log("No token provided");
        }

        const currentTime = new Date();
        const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

        if (!isAdmin) {
            // Exclude banned listings if the user is not an administrator
            query.$and = [
                {
                    $or: [
                        { 'ban.banPermanently': { $ne: true } },
                        { 'ban.banPermanently': { $exists: false } }
                    ]
                },
                {
                    $or: [
                        { 'ban.banTime': { $lte: twoHoursLater } },
                        { 'ban.banTime': { $exists: false } }
                    ]
                }
            ];
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



/**
 * Controller function for adding a new listing.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function addListing(req, res) {
    const errors = [];


    const { address, photos, publisherID, tenantsID, typology, description, price, floorArea, availability, publicationDate } = req.body;

    try {
        //address check
        if (!address) 
            errors.push({ field: "address", message: "missing address" }) //empty address

        if (!address.street) 
            errors.push({ field: "street", message: "missing street" });

        if (!address.city) 
            errors.push({ field: "city", message: "missing city" })

        if (!address.cap) 
            errors.push({ field: "cap", message: "invalid cap" })

        if (!address.houseNum) 
            errors.push({ field: "houseNum", message: "missing houseNum" })
        else if (!(/\d/.test(address.houseNum))) 
            errors.push({ field: "houseNum", message: "does not contain a number" })

        if (!address.province) 
            errors.push({ field: "province", message: "missing province" })
        else if (address.province.length != 2) 
            errors.push({ field: "province", message: "province needs to be only two character" })

        if (!address.country) 
            errors.push({ field: "country", message: "missing country" })

        //photos check
        if (photos.length < 1 || photos.length > 10) 
            errors.push({ field: "photos", message: "not enough photos" });

        //publisheerId check    
        if (publisherID) {
            const pubId = await User.findById(publisherID)
            if (!pubId) {
                errors.push({ field: "publisherID", message: "publisher id doesn't exists" });
            }
        }
        else { errors.push({ field: "publisherID", message: "missing publisher id" }); }

        //tenantsId check
        if (tenantsID) {
            tenantsID.map(async (id) => {
                const checkId = await User.findById(id)
                if (!checkId) errors.push({ field: `tenants id:${id}`, message: "invalid id" })
            })
        }
        //description check
        if (!description) 
            errors.push({ field: "description", message: "missing descriprion" })

        //typology check
        if (!typology) 
            errors.push({ field: "typology", message: "missing typology" })

        //price check
        if (!price || price < 10 || price > 10000) 
            errors.push({ field: "price", message: "invalid price" })

        //floorArea check
        if (!floorArea || floorArea < 10 || floorArea > 10000) 
            errors.push({ field: "floorArea", message: "invalid floorArea" })

        //availability check
        if (!availability) 
            errors.push({ field: "availability", message: " missing availability " })
        
        if (errors.length > 0) {
            return res.status(401).json({ message: "error", errors })
        }
        const newListing = await Listing.create({
            address: address,
            photos: photos,
            publisherID: publisherID,
            tenantsID: tenantsID,
            typology: typology,
            description: description,
            price: price,
            floorArea: floorArea,
            availability: availability
        })
        if (!newListing) {
            return res.status(401).json({ message: "error", reason: 'Error during the user update' });
        }

        const updatedUser = await User.findByIdAndUpdate(newListing.publisherID,
            { $set: { listingID: newListing._id } },
            { new: true } // Return the modified document)
        )

        if(updatedUser){
            return res.status(201).json({ message: 'Listing added successfully', data: newListing });

        }
        else {
            return res.status(401).json({ message: "error", reason: 'Error during the user update' });
        }


    } catch (error) {

        console.error("Error  creating listing:", error);
        return res.status(500).json({ message: "error", reason: "Internal server error" });
    }
}


/**
 * Controller function for retrieving a listing by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getListingById(req, res) {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            console.log("Listing not found.");
            return res.status(400).json({ message: "Listing not found" });
        }

        console.log("Listing retrieved successfully.");
        return res.status(200).json({ listing: listing });

    } catch (error) {
        console.error("Error retrieving listing:", error);
        return res.status(500).json({ message: "Error retrieving listing", error: error.message });
    }
}

/**
 * Controller function for updating a listing by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const updateListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const errors = [];

        // Retrieve current listing
        const currentListing = await Listing.findById(id);
        if (!currentListing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Address validation
        if (updates.address) {
            const address = updates.address;
            const currentAddress = currentListing.address || {};

            if (address.street !== undefined && !address.street) 
                errors.push({ field: "street", message: "missing street" });

            if (address.street !== undefined && (address.street.length < 3 || address.street.length > 50)) 
                errors.push({ field: "street", message: "street length must be between 3 and 50 characters" });

            if (address.city !== undefined && !address.city) 
                errors.push({ field: "city", message: "missing city" });

            if (address.city !== undefined && (address.city.length < 3 || address.city.length > 50)) 
                errors.push({ field: "city", message: "city length must be between 3 and 50 characters" });

            if (address.cap !== undefined && !address.cap) 
                errors.push({ field: "cap", message: "invalid cap" });

            if (address.cap !== undefined && !(/^\d{5}$/.test(address.cap))) 
                errors.push({ field: "cap", message: "CAP must contain exactly 5 digits" });

            if (address.houseNum !== undefined && !address.houseNum) 
                errors.push({ field: "houseNum", message: "missing houseNum" });

            if (address.houseNum !== undefined && (address.houseNum.length < 1 || address.houseNum.length > 5)) 
                errors.push({ field: "houseNum", message: "houseNum length must be between 1 and 5 characters" });

            if (address.province !== undefined && !address.province)
                errors.push({ field: "province", message: "missing province" });

            if (address.province !== undefined && (address.province.length !== 2)) 
                errors.push({ field: "province", message: "province must be exactly 2 characters" });

            if (address.country !== undefined && !address.country) 
                errors.push({ field: "country", message: "missing country" });
            if (address.country !== undefined && (address.country.length < 3 || address.country.length > 50)) 
                errors.push({ field: "country", message: "country length must be between 3 and 50 characters" });

            // Merge address updates
            currentListing.address = { ...currentAddress, ...address };
        }

        // Photos validation
        if (updates.photos !== undefined) {
            if (updates.photos.length < 1 || updates.photos.length > 10) 
                errors.push({ field: "photos", message: "photos must contain between 1 and 10 items" });
        }

        // Publisher ID validation
        if (updates.publisherID !== undefined && updates.publisherID != currentListing.publisherID) {
                    errors.push({ field: "publisherID", message: "publisher can't be changed" }); 
        }

        // Tenants ID validation
        if (updates.tenantsID !== undefined) {
            if (updates.tenantsID.length > 12) errors.push({ field: "tenantsID", message: "tenantsID must contain up to 12 items" });
            for (const id of updates.tenantsID) {
                const checkId = await User.findById(id);
                if (!checkId) errors.push({ field: `tenantsID`, message: `invalid id: ${id}` });
            }
        }

        // Typology validation
        if (updates.typology !== undefined && !updates.typology) {
            errors.push({ field: "typology", message: "missing typology" });
        }
        if (updates.typology !== undefined && updates.typology.length > 30) {
            errors.push({ field: "typology", message: "typology length must be up to 30 characters" });
        }

        // Description validation
        if (updates.description !== undefined && updates.description.length > 1000) {
            errors.push({ field: "description", message: "description length must be up to 1000 characters" });
        }

        // Price validation
        if (updates.price !== undefined && (updates.price < 10 || updates.price > 10000)) {
            errors.push({ field: "price", message: "price must be between 10 and 10000" });
        }

        // Floor area validation
        if (updates.floorArea !== undefined && (updates.floorArea < 1 || updates.floorArea > 10000)) {
            errors.push({ field: "floorArea", message: "floorArea must be between 1 and 10000" });
        }

        // Availability validation
        if (updates.availability !== undefined && updates.availability.length > 250) {
            errors.push({ field: "availability", message: "availability length must be up to 250 characters" });
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: "Validation errors", errors });
        }

        // Apply the updates to the current listing
        Object.keys(updates).forEach(key => {
            if (key !== 'address') {
                currentListing[key] = updates[key];
            }
        });

        // Save updated listing
        console.log(currentListing);
        const listing = await currentListing.save();

        console.log("Listing updated successfully.");
        return res.status(200).json({ listing });

    } catch (error) {
        console.error("Error updating listing:", error);
        return res.status(500).json({ message: "Error updating listing", error: error.message });

    }

};



/**
 * Controller function for deleting a listing by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function deleteListingById(req, res) {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            console.log("Listing not found.");
            return res.status(400).json({ message: "Listing not found" });
        }

        const userId = listing.publisherID;
        const user = await User.findById(userId);
        if (!user) {
            console.log("Publisher not found.");
            return res.status(400).json({ message: "Publisher not found" });
        }

        await Listing.findByIdAndDelete(id);

        await NotificationModel.create({
            userID: user._id,
            type: "alert",
            message: `Your listing has been deleted because it did not comply with Unidomus policies`,
            link: `/addListing`,
            priority: notificationPriorityEnum.HIGH
        });

        console.log("Listing deleted successfully.");
        return res.status(200).json({ message: "Listing deleted successfully"});
    } catch (error) {
        console.error("Error deleting listing:", error);
        return res.status(500).json({ message: "Error deleting listing", error: error.message });
    }
}


/**
 * Controller function for converting listing addresses to coordinates.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function addressToCoordinates(req, res) {
    try {
        // Parse query parameters
        let query = {};
        const { priceMin, priceMax, typology, city, floorAreaMin, floorAreaMax } = req.query;

        // Construct the query object
        if (priceMin || priceMax) {

            query.price = {};
            if (priceMin) 
                query.price.$gte = Number(priceMin);
            if (priceMax) 
                query.price.$lte = Number(priceMax);
        }
        if (floorAreaMin || floorAreaMax) {

            query.floorArea = {};
            if (floorAreaMin) 
                query.floorArea.$gte = Number(floorAreaMin);
            if (floorAreaMax) 
                query.floorArea.$lte = Number(floorAreaMax);
        }
        if (typology) {
            query.typology = typology;
        }
        if (city) {
            query['address.city'] = city;
        }

        // Execute the query with filters
        const listings = await Listing.find(query);

        if (!listings.length) {
            console.log("Filtered query returned no listings.");
            return res.status(200).json({ listings: [] });
        }

        const coordinates = [];
        await Promise.all(listings.map(async (item) => {
            await fetch("http://api.positionstack.com/v1/forward?" + new URLSearchParams({
                access_key: process.env.GEOCODING_API_KEY,
                query: `${item.address.street} ${item.address.houseNum}, ${item.address.cap}`,
                country: "IT",
                region: "Trento",
                limit: 1
            }))
            .then(async (response) => {
                if (!response.ok) {
                    const errorBody = await response.json();
                    throw new Error({ message: 'Error converting address' });
                } else {
                    return response.json();
                }
            })
            .then(body => {
                if (body && body.data && body.data.length) {
                    coordinates.push({
                        latitude: body.data[0].latitude,
                        longitude: body.data[0].longitude,
                        label: body.data[0].label
                    });
                }
            })
            .catch(error => {
                console.error('Error converting address:', error);
                throw new Error( "Error converting address" );
            });
        }));

        console.log(coordinates);
        if (!coordinates.length) {
            console.log("Bad addresses or no conversion.");
            return res.status(200).json({ data: [] });
        } else {
            return res.status(200).json({ data: coordinates });
        }
        
    } catch (error) {
        console.error("Error retrieving listings with filters:", error.message);
        return res.status(500).json({ message: "Error retrieving listings", error: error.message  });
    }
}



/**
 * Controller function for getting coordinates of a listing by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getCoordinatesById(req, res) {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);


        if (!listing) {
            console.log("Listing not found.");
            return res.status(400).json({ message: "Listing not found" });
        }

        console.log("Listing retrieved successfully.");
        await fetch("http://api.positionstack.com/v1/forward?" + new URLSearchParams({
            access_key: process.env.GEOCODING_API_KEY,
            query: `${listing.address.street} ${listing.address.houseNum}, ${listing.address.cap}`,
            country: "IT",
            region: "Trento",
            limit: 1
        })
        )
        .then(async (response) => {
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || 'Error converting address');
            } else {
                return response.json();
            }
        }).then(body => {
            if (body && body.data && body.data.length) {
                return res.status(200).json({ data: { latitude: body.data[0].latitude, longitude: body.data[0].longitude, label: body.data[0].label } });
            } else {
                return res.status(200).json({ data: [] });
            }
        })
        .catch(error => {
            console.error('Error converting address:', error);
            return res.status(500).json({ message: "Error converting address", error: error.message });
        });
    } catch (error) {
        console.error("Error retrieving listing:", error);
        return res.status(500).json({ message: "Error retrieving listing", error: error.message });
    }
}




/**
 * Controller function to ban a listing by ID for a specified duration or permanently.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function banListingById(req, res) {
    try {
        const { id } = req.params;
        const { banTimeInSeconds, banPermanently, banMsg } = req.body;

        // Validate ban time
        if (!banPermanently && (!banTimeInSeconds || isNaN(banTimeInSeconds) || banTimeInSeconds <= 0)) {
            return res.status(400).json({ message: "Invalid ban time provided" });
        }

        let listingUpdateData = {};
        
        // Retrieve the listing to check current ban details
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Increment prevBanNum
        const prevBanNum = listing.ban && listing.ban.prevBanNum ? listing.ban.prevBanNum + 1 : 1;

        let banDuration;
        if (banPermanently) {
            listingUpdateData = {
                'ban.banPermanently': true,
                'ban.banTime': null,
                'ban.prevBanNum': prevBanNum,
                'ban.banMsg': banMsg // Add ban message for listing
            };
            banDuration = 'permanently';
        } else {
            console.log(`Banning listing with ID: ${id} for ${banTimeInSeconds} seconds plus 2 hours`);

            // Calculate the ban expiration date by adding banTimeInSeconds and additional 2 hours (7200 seconds)
            const totalBanTimeInSeconds = banTimeInSeconds + 7200;
            const banExpirationDate = new Date(Date.now() + totalBanTimeInSeconds * 1000);

            console.log(`Calculated ban expiration date: ${banExpirationDate}`);

            listingUpdateData = {
                'ban.banTime': banExpirationDate,
                'ban.banPermanently': false,
                'ban.prevBanNum': prevBanNum,
                'ban.banMsg': banMsg // Add ban message for listing
            };
            banDuration = convertSecondsToDHMS(banTimeInSeconds);
        }

        // Update the listing's ban details using findByIdAndUpdate
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { $set: listingUpdateData },
            { new: true, runValidators: true } // Ensure validators run
        );

        if (!updatedListing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        console.log(`Listing updated successfully`);

        await NotificationModel.create({
            userID: listing.publisherID,
            type: "alert",
            message: banPermanently ? 
                `Your listing has been banned permanently because it did not comply with UniDomus policies. Reason: ${banMsg}` :
                `Your listing has been banned for ${banDuration} because it did not comply with UniDomus policies. Reason: ${banMsg}`,
            link: `/`,
            priority: notificationPriorityEnum.HIGH
        });

        return res.status(200).json({ 
            message: "Listing banned successfully", 
            listingBan: updatedListing.ban 
        });
    } catch (error) {
        console.error("Error banning listing:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


/**
 * Controller function to unban a listing by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function unbanListingById(req, res) {
    try {
        const { id } = req.params;
        const currentTime = new Date();
        const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

        // Find the listing by ID
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Check if the listing is banned (permanently or temporarily)
        const isBanned = listing.ban.banPermanently || (listing.ban.banTime && listing.ban.banTime > twoHoursLater);
        if (!isBanned) {
            return res.status(400).json({ message: "Listing is not banned" });
        }

        // Unban the listing
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { $unset: { 'ban.banTime': '', 'ban.banPermanently': '', 'ban.banMsg': '' } },
            { new: true }
        );

        await NotificationModel.create({
            userID: listing.publisherID,
            type: "alert",
            message: `Your listing has been unbanned`,
            link: `/`,
            priority: notificationPriorityEnum.MEDIUM
        });

        console.log(`Listing unbanned successfully`);
        return res.status(200).json({
            message: "Listing unbanned successfully"
        });
    } catch (error) {
        console.error("Error unbanning listing:", error);
        return res.status(500).json({ message: "Error unbanning listing", error: error.message });
    }
}


module.exports = {
    listings,
    addListing,
    getListingById,
    updateListingById,
    deleteListingById,
    addressToCoordinates,
    getCoordinatesById,
    banListingById,
    unbanListingById
};

