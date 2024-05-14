const { listings,addListing, getListingById } = require('../controllers/listingController.js');
const Listing = require('../models/listingModel.js');
const User = require('../models/userModel.js');
const request = require('supertest');
const app = require('../../index.js');
const jwt = require('jsonwebtoken'); 
const { before, default: test } = require('node:test');
const { default: mongoose } = require('mongoose');
require('dotenv').config({ path: '../../.env' });


jest.mock('../models/userModel'); // Mock the User model for testing
jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());



describe('Listing Controller', () => {
  // Mock the response object
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Mock the request object with query parameters
  const req = {
    query: {
      priceMin: '1000',
      priceMax: '2000',
      typology: 'doppia',
      city: 'Trento',
      floorAreaMin: '50',
      floorAreaMax: '100',
    },
  };

  // Mock the listings data from the database
  const mockListings = [
    { price: 1500, typology: 'doppia', address: { city: 'Trento' }, floorArea: 80 },
    { price: 1800, typology: 'doppia', address: { city: 'Trento' }, floorArea: 90 },
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock function calls before each test
  });
  describe('GET api/listing', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test
    });

    // Tests that listings are returned correctly when filtered by valid query parameters.
    it('should return filtered listings when valid query parameters are provided', async () => {
        // Spy on the find method of Listing model and mock its implementation
        jest.spyOn(Listing, 'find').mockResolvedValue(mockListings);

        await listings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ listings: mockListings });
        expect(Listing.find).toHaveBeenCalledWith({
            price: { $gte: 1000, $lte: 2000 },
            typology: 'doppia',
            'address.city': 'Trento',
            floorArea: { $gte: 50, $lte: 100 }
        }); 
    });

    // Tests that an empty array is returned when no listings match the filter criteria.
    it('should return an empty array when no listings match the filter criteria', async () => {
        // Continue spying on the find method but mock a different return value
        jest.spyOn(Listing, 'find').mockResolvedValue([]);

        await listings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ listings: [] });
    });

    // Tests that a server error is correctly handled and reported when there's a database issue.
    it('should handle errors and return 500 status code with an error message', async () => {
        // Mock find method to throw an error
        jest.spyOn(Listing, 'find').mockRejectedValue(new Error('Database error'));

        await listings(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving listings', error: 'Database error' });
    });
});

describe('GET api/listing/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test
    });

    // Verifies correct listing retrieval based on specific filters.
    it('should return a listing when a valid ID is provided', async () => {
        const id = 'validId';
        const mockListing = { _id: id, price: 1500, typology: 'doppia', address: { city: 'Trento' }, floorArea: 80 };

        // Spy on findById and mock its implementation to resolve with mockListing
        jest.spyOn(Listing, 'findById').mockResolvedValue(mockListing);

        const req = { params: { id: id } };

        await getListingById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ listing: mockListing });
        expect(Listing.findById).toHaveBeenCalledWith(id); // Confirm that findById was called with the correct ID
    });

    // Ensures an empty array is returned when no listings match the criteria.
    it('should return 400 status code when no listing is found with the provided ID', async () => {
        const id = 'invalidId';

        // Continue spying on findById but mock it to resolve with null
        jest.spyOn(Listing, 'findById').mockResolvedValue(null);

        const req = { params: { id: id } };

        await getListingById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Listing not found' });
    });

    // Checks proper error handling for database errors during listing retrieval.
    it('should handle errors and return 500 status code with an error message', async () => {
        const id = 'validId';

        // Mock findById to reject with an error
        jest.spyOn(Listing, 'findById').mockRejectedValue(new Error('Database error'));

        const req = { params: { id: id } };

        await getListingById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving listing', error: 'Database error' });
    });
});

describe('POST api/listing/add', () => {
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    const req = {
        body: {
            address: {
                street: "via giselga",
                city: "dajk",
                cap: "56783",
                houseNum: "20A",
                province: "OT",
                country: "Albania"
            },
            photos: ["dwndioawhndaiuwdhuiawbdbia"],
            publisherID: "663a04e09e58376e172487c5",
            tenantsID: ["663aae1501904d57b8818092"],
            typology: "adnawd",
            description: "string",
            price: 100,
            floorArea: 100,
            availability: "dawdawda"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Listing, 'create').mockClear();
        jest.spyOn(User, 'findById').mockClear();
        jest.spyOn(User, 'findByIdAndUpdate').mockClear();
    });

    // Verifies successful listing creation when all validations pass and user is found.
    it('should create a listing successfully', async () => {
        jest.spyOn(User, 'findById').mockResolvedValue(true); // Simulate user found
        jest.spyOn(Listing, 'create').mockResolvedValue(req.body); // Simulate successful listing creation
        jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(true);

        await addListing(req, res);

        expect(User.findById).toHaveBeenCalledWith(req.body.publisherID);
        expect(Listing.create).toHaveBeenCalledWith(expect.objectContaining(req.body));
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(req.body.publisherID, expect.any(Object), { new: true });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Listing added successfully', data: req.body });
    });

    // Tests for an error response when no photos are included in the listing.
    it('should return an error if there are no photos provided', async () => {
        const modifiedReq = { ...req, body: { ...req.body, photos: [] } }; // No photos

        await addListing(modifiedReq, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "error",
            errors: expect.arrayContaining([
                { field: "photos", message: "not enough photos" }
            ])
        });
    });

    // Checks for proper error handling when a database error occurs during listing creation.
    it('should handle database errors during listing creation', async () => {
        jest.spyOn(Listing, 'create').mockRejectedValue(new Error('Database error'));

        await addListing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "error", reason: "Internal server error" });
    });

    // Ensures correct error handling when publisher or tenant IDs are not found.
    it('should handle ID not found errors for publisherID and tenantsID', async () => {
        jest.spyOn(User, 'findById').mockResolvedValue(null); // Simulate ID not found

        await addListing(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                { field: "publisherID", message: "publisher id doesn't exists" },
                { field: "tenants id:"+req.body.tenantsID, message: "invalid id" }
            ]),
            message: "error"
        });
    });

    // Tests for appropriate error management when a database error occurs during user ID verification.
    it('should handle database errors during findById', async () => {
        jest.spyOn(User, 'findById').mockRejectedValue(new Error('Database error'));

        await addListing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "error", reason: "Internal server error" });
    });
});
});

