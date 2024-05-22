const { log } = require('console');
const Listing = require('../models/listingModel');
require('dotenv').config({ path: '../../.env' });
const User = require('../models/userModel');
const { query } = require('express');

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

async function addListing(req, res) {
    const errors = [];


    const { address, photos, publisherID, tenantsID, typology, description, price, floorArea, availability, publicationDate } = req.body;

    try {
        //address check
        if (!address) errors.push({ field: "address", message: "missing address" }) //empty address

        if (!address.street) errors.push({ field: "street", message: "missing street" });

        if (!address.city) errors.push({ field: "city", message: "missing city" })

        if (!address.cap) errors.push({ field: "cap", message: "invalid cap" })

        if (!address.houseNum) errors.push({ field: "houseNum", message: "missing houseNum" })
        else if (!(/\d/.test(address.houseNum))) errors.push({ field: "houseNum", message: "does not contain a number" })

        if (!address.province) errors.push({ field: "province", message: "missing province" })
        else if (address.province.length != 2) errors.push({ field: "province", message: "province needs to be only two character" })

        if (!address.country) errors.push({ field: "country", message: "missing country" })

        //photos check
        if (photos.length < 1 || photos.length > 10) errors.push({ field: "photos", message: "not enough photos" });
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
        if (!description) errors.push({ field: "description", message: "missing descriprion" })
        //typology check
        if (!typology) errors.push({ field: "typology", message: "missing typology" })
        //price check
        if (!price || price < 10 || price > 10000) errors.push({ field: "price", message: "invalid price" })
        //floorArea check
        if (!floorArea || floorArea < 10 || floorArea > 10000) errors.push({ field: "floorArea", message: "invalid floorArea" })
        //availability check
        if (!availability) errors.push({ field: "availability", message: "availability" })
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

async function addressToCoordinates(req, res) {
    try {
        // Parse query parameters
        let query = {};
        const { priceMin, priceMax, typology, city, floorAreaMin, floorAreaMax } = req.query;

        // Construct the query object
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
            .then(response => {
                if (!response.ok) {
                    return null;
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
        console.error("Error retrieving listings with filters:", error);
        return res.status(500).json({ message: "Error retrieving listings", error: error.message });
    }
}



module.exports = {
    listings,
    addListing,
    getListingById,
    addressToCoordinates,
    getCoordinatesById
};

