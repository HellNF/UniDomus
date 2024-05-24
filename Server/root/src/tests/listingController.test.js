const request = require('supertest');
const app = require('../../app.js'); 
const Listing = require('../models/listingModel.js');
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

jest.mock('../models/userModel'); // Mock the User model for testing
jest.mock('../models/listingModel'); // Mock the Listing model for testing

jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());

describe('Listing Controller', () => {
    let token;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test

        // Generate a valid JWT token for testing
        token = jwt.sign({ id: 'testUserId' }, process.env.SUPER_SECRET, { expiresIn: '1h' });
    });

    describe('GET /api/listings', () => {
        it('should return filtered listings when valid query parameters are provided', async () => {
            const mockListings = [
                { price: 1500, typology: 'doppia', address: { city: 'Trento' }, floorArea: 80 },
                { price: 1800, typology: 'doppia', address: { city: 'Trento' }, floorArea: 90 },
            ];

            Listing.find.mockResolvedValue(mockListings);

            const response = await request(app)
                .get('/api/listings')
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
                .get('/api/listings')
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
                .get('/api/listings')
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

    describe('GET /api/listings/:id', () => {
        it('should return a listing when a valid ID is provided', async () => {
            const id = 'validId';
            const mockListing = { _id: id, price: 1500, typology: 'doppia', address: { city: 'Trento' }, floorArea: 80 };

            Listing.findById.mockResolvedValue(mockListing);

            const response = await request(app)
                .get(`/api/listings/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ listing: mockListing });
            expect(Listing.findById).toHaveBeenCalledWith(id);
        });

        it('should return 400 status code when no listing is found with the provided ID', async () => {
            const id = 'invalidId';

            Listing.findById.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/listings/${id}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Listing not found' });
        });

        it('should handle errors and return 500 status code with an error message', async () => {
            const id = 'validId';

            Listing.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/listings/${id}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error retrieving listing', error: 'Database error' });
        });
    });

     describe('PUT /api/listings/:id', () => {
        const listingId = 'validListingId';
        const updateData = {
            price: 2000,
            typology: 'doppia',
            address: {
                street: 'via Milano',
                city: 'Milano',
                cap: '20121',
                houseNum: '10B',
                province: 'MI',
                country: 'ITA'
            },
            description: 'appartamento ristrutturato',
            floorArea: 120
        };
        it('should update a listing successfully', async () => {
            const mockUpdatedListing = { _id: listingId, ...updateData };

            Listing.findById.mockResolvedValue({ _id: listingId, save: jest.fn().mockResolvedValue(mockUpdatedListing) });

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ listing: mockUpdatedListing });
            expect(Listing.findById).toHaveBeenCalledWith(listingId);
        });
        it('should return 404 if listing is not found', async () => {
            Listing.findById.mockResolvedValue(null);

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(updateData);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Listing not found' });
        });

        it('should return validation errors for invalid data', async () => {
            const invalidUpdateData = {
                price: -100, // Invalid price
                typology: 'doppia',
                address: {
                    street: 'via', // Too short
                    city: 'Mi', // Too short
                    cap: '21', // Invalid cap
                    houseNum: '10B',
                    province: 'MI',
                    country: 'IT' // Too short
                },
                description: 'appartamento ristrutturato',
                floorArea: 120
            };

            Listing.findById.mockResolvedValue({ _id: listingId, ...updateData });

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(invalidUpdateData);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(expect.arrayContaining([{"field": "city", "message": "city length must be between 3 and 50 characters"}, 
            {"field": "cap", "message": "CAP must contain exactly 5 digits"}, 
            {"field": "country", "message": "country length must be between 3 and 50 characters"}, 
            {"field": "price", "message": "price must be between 10 and 10000"}]));
        });

        it('should return validation errors for too many photos', async () => {
            const invalidUpdateData = {
                ...updateData,
                photos: new Array(11).fill('pic') // Invalid photos array with 11 items
            };

            Listing.findById.mockResolvedValue({ _id: listingId, ...updateData });

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(invalidUpdateData);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(expect.arrayContaining([
                { field: 'photos', message: 'photos must contain between 1 and 10 items' }
            ]));
        });

        it('should return validation errors if publisherID is changed', async () => {
            const invalidUpdateData = {
                ...updateData,
                publisherID: 'newPublisherId' // Trying to change the publisher ID
            };

            Listing.findById.mockResolvedValue({ _id: listingId, publisherID: 'originalPublisherId', save: jest.fn().mockResolvedValue({ _id: listingId, ...updateData }) });

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(invalidUpdateData);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(expect.arrayContaining([
                { field: 'publisherID', message: "publisher can't be changed" }
            ]));
        });

        it('should return validation errors for invalid tenantsID', async () => {
            const invalidUpdateData = {
                ...updateData,
                tenantsID: ['invalidUserId'] // Invalid tenant ID
            };

            User.findById.mockResolvedValue(null);
            Listing.findById.mockResolvedValue({ _id: listingId, ...updateData });

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(invalidUpdateData);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(expect.arrayContaining([
                { field: 'tenantsID', message: 'invalid id: invalidUserId' }
            ]));
        });

        it('should handle errors and return 500 status code with an error message', async () => {
            Listing.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put(`/api/listings/${listingId}`)
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(updateData);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error updating listing', error: 'Database error' });
        });
    });

    describe('POST /api/listings', () => {
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
                .post('/api/listings')
                .set('x-access-token', `${token}`) // Set the token in the header
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
                .post('/api/listings')
                .set('x-access-token', `${token}`) // Set the token in the header
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
                .post('/api/listings')
                .set('x-access-token', `${token}`) // Set the token in the header
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
                .post('/api/listings')
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(reqBody);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error", reason: "Internal server error" });
        });

        it('should handle ID not found errors for publisherID and tenantsID', async () => {
            User.findById.mockResolvedValue(null); // Simulate ID not found

            const response = await request(app)
                .post('/api/listings')
                .set('x-access-token', `${token}`) // Set the token in the header
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
                .post('/api/listings')
                .set('x-access-token', `${token}`) // Set the token in the header
                .send(reqBody);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error", reason: "Internal server error" });
        });
    });

    describe('GET /api/listings/coordinates/:id', () => {
        it('should return coordinates for a valid listing ID', async () => {
            const id = 'validId';
            const mockListing = {
                _id: id,
                address: {
                    street: 'via Roma',
                    houseNum: '20A',
                    cap: '38122'
                }
            };

            Listing.findById.mockResolvedValue(mockListing);

            const mockGeocodeResponse = {
                data: [
                    {
                        latitude: 46.066,
                        longitude: 11.121,
                        label: 'via Roma 20A, 38122 Trento, Italy'
                    }
                ]
            };

            // Mock the fetch function to return a successful geocoding response
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockGeocodeResponse)
                })
            );

            const response = await request(app)
                .get(`/api/listings/coordinates/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                data: {
                    latitude: 46.066,
                    longitude: 11.121,
                    label: 'via Roma 20A, 38122 Trento, Italy'
                }
            });
        });

        it('should return 400 if listing is not found', async () => {
            const id = 'invalidId';

            Listing.findById.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/listings/coordinates/${id}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Listing not found' });
        });

        it('should return 500 if there is an error retrieving the listing', async () => {
            const id = 'validId';

            Listing.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/listings/coordinates/${id}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error retrieving listing', error: 'Database error' });
        });

        it('should return 500 if there is an error during geocoding', async () => {
            const id = 'validId';
            const mockListing = {
                _id: id,
                address: {
                    street: 'via Roma',
                    houseNum: '20A',
                    cap: '38122'
                }
            };

            Listing.findById.mockResolvedValue(mockListing);

            // Mock the fetch function to return a geocoding error
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: 'Error converting address' }) // Mocked error response
                })
            );

            const response = await request(app)
                .get(`/api/listings/coordinates/${id}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error converting address', error: 'Error converting address' });
        });
    });

    describe('GET /api/listings/coordinates', () => {
        it('should return coordinates for listings matching the filters', async () => {
            const mockListings = [
                {
                    _id: 'listing1',
                    address: {
                        street: 'via Roma',
                        houseNum: '20A',
                        cap: '38122'
                    }
                },
                {
                    _id: 'listing2',
                    address: {
                        street: 'via Milano',
                        houseNum: '10B',
                        cap: '20121'
                    }
                }
            ];

            Listing.find.mockResolvedValue(mockListings);

            const mockGeocodeResponse1 = {
                data: [
                    {
                        latitude: 46.066,
                        longitude: 11.121,
                        label: 'via Roma 20A, 38122 Trento, Italy'
                    }
                ]
            };

            const mockGeocodeResponse2 = {
                data: [
                    {
                        latitude: 45.465,
                        longitude: 9.19,
                        label: 'via Milano 10B, 20121 Milano, Italy'
                    }
                ]
            };

            // Mock delle risposte di fetch per ogni indirizzo
            global.fetch = jest.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockGeocodeResponse1)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockGeocodeResponse2)
                });

            const response = await request(app)
                .get('/api/listings/coordinates')
                .query({ city: 'Trento' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                data: [
                    {
                        latitude: 46.066,
                        longitude: 11.121,
                        label: 'via Roma 20A, 38122 Trento, Italy'
                    },
                    {
                        latitude: 45.465,
                        longitude: 9.19,
                        label: 'via Milano 10B, 20121 Milano, Italy'
                    }
                ]
            });
        });

        it('should return an empty array if no listings match the filters', async () => {
            Listing.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/api/listings/coordinates')
                .query({ city: 'NonExistentCity' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ listings: [] });
        });

        it('should return 500 if there is an error retrieving the listings', async () => {
            Listing.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/listings/coordinates');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error retrieving listings', error: 'Database error' });
        });

        it('should handle errors during geocoding', async () => {
            const mockListings = [
                {
                    _id: 'listing1',
                    address: {
                        street: 'via Roma',
                        houseNum: '20A',
                        cap: '38122'
                    }
                }
            ];

            Listing.find.mockResolvedValue(mockListings);

            // Mock della risposta di fetch con errore
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: 'Error converting address' }) // Mocked error response
                })
            );

            const response = await request(app)
                .get('/api/listings/coordinates')
                .query({ city: 'Trento' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error retrieving listings', error: 'Error converting address' });
        });
    });

});


