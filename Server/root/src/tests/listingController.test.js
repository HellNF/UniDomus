const request = require('supertest');
const app = require('../../app.js'); 
const Listing = require('../models/listingModel.js');
const User = require('../models/userModel.js');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

jest.mock('../models/userModel'); // Mock the User model for testing
jest.mock('../models/listingModel'); // Mock the Listing model for testing

jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());

describe('Listing Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test
    });

    describe('GET /api/listing', () => {
        it('should return filtered listings when valid query parameters are provided', async () => {
            const mockListings = [
                { price: 1500, typology: 'doppia', address: { city: 'Trento' }, floorArea: 80 },
                { price: 1800, typology: 'doppia', address: { city: 'Trento' }, floorArea: 90 },
            ];

            Listing.find.mockResolvedValue(mockListings);

            const response = await request(app)
                .get('/api/listing')
                .query({
                    priceMin: '1000',
                    priceMax: '2000',
                    typology: 'doppia',
                    city: 'Trento',
                    floorAreaMin: '50',
                    floorAreaMax: '100'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ listings: mockListings });
            expect(Listing.find).toHaveBeenCalledWith({
                price: { $gte: 1000, $lte: 2000 },
                typology: 'doppia',
                'address.city': 'Trento',
                floorArea: { $gte: 50, $lte: 100 }
            });
        });

        it('should return an empty array when no listings match the filter criteria', async () => {
            Listing.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/api/listing')
                .query({
                    priceMin: '1000',
                    priceMax: '2000',
                    typology: 'doppia',
                    city: 'Trento',
                    floorAreaMin: '50',
                    floorAreaMax: '100'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ listings: [] });
        });

        it('should handle errors and return 500 status code with an error message', async () => {
            Listing.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/listing')
                .query({
                    priceMin: '1000',
                    priceMax: '2000',
                    typology: 'doppia',
                    city: 'Trento',
                    floorAreaMin: '50',
                    floorAreaMax: '100'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error retrieving listings', error: 'Database error' });
        });
    });

    describe('GET /api/listing/:id', () => {
        it('should return a listing when a valid ID is provided', async () => {
            const id = 'validId';
            const mockListing = { _id: id, price: 1500, typology: 'doppia', address: { city: 'Trento' }, floorArea: 80 };

            Listing.findById.mockResolvedValue(mockListing);

            const response = await request(app)
                .get(`/api/listing/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ listing: mockListing });
            expect(Listing.findById).toHaveBeenCalledWith(id);
        });

        it('should return 400 status code when no listing is found with the provided ID', async () => {
            const id = 'invalidId';

            Listing.findById.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/listing/${id}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Listing not found' });
        });

        it('should handle errors and return 500 status code with an error message', async () => {
            const id = 'validId';

            Listing.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/listing/${id}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error retrieving listing', error: 'Database error' });
        });
    });

    describe('POST /api/listing/add', () => {
        const reqBody = {
            address: {
                street: "via Roma",
                city: "Trento",
                cap: "38122",
                houseNum: "20A",
                province: "TN",
                country: "ITA"
            },
            photos: ["pic1", "pic2"],
            publisherID: "663a04e09e58376e172487c5",
            tenantsID: ["663aae1501904d57b8818092"],
            typology: "singola",
            description: "spaziosa e soleggiata",
            price: 100,
            floorArea: 100,
            availability: "dal primo settembre"
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should create a listing successfully', async () => {
            User.findById.mockResolvedValue(true); // Simulate user found
            Listing.create.mockResolvedValue(reqBody); // Simulate successful listing creation
            User.findByIdAndUpdate.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/listing/add')
                .send(reqBody);

            expect(User.findById).toHaveBeenCalledWith(reqBody.publisherID);
            expect(Listing.create).toHaveBeenCalledWith(expect.objectContaining(reqBody));
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(reqBody.publisherID, expect.any(Object), { new: true });
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Listing added successfully', data: reqBody });
        });

        it('should return an error if there are no photos', async () => {
            const modifiedReqBody = { ...reqBody, photos: [] }; // No photos

            const response = await request(app)
                .post('/api/listing/add')
                .send(modifiedReqBody);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: "photos", message: "not enough photos" }]
            });
        });

        it('should return an error if price is missing', async () => {
            const { price, ...restOfBody } = reqBody;
            const modifiedReqBody = { ...restOfBody }; // 'price' is now omitted

            const response = await request(app)
                .post('/api/listing/add')
                .send(modifiedReqBody);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: "price", message: "invalid price" }]
            });
        });

        it('should handle database errors during listing creation', async () => {
            Listing.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/listing/add')
                .send(reqBody);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error", reason: "Internal server error" });
        });

        it('should handle ID not found errors for publisherID and tenantsID', async () => {
            User.findById.mockResolvedValue(null); // Simulate ID not found

            const response = await request(app)
                .post('/api/listing/add')
                .send(reqBody);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                errors: [
                    { field: "publisherID", message: "publisher id doesn't exists" }
                ],
                message: "error"
            });
        });

        it('should handle database errors during findById', async () => {
            User.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/listing/add')
                .send(reqBody);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error", reason: "Internal server error" });
        });
    });
});
