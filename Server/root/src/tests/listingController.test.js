const { listings, getListingById } = require('../controllers/listingController');
const Listing = require('../models/listingModel');

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
      typology: 'apartment',
      city: 'New York',
      floorAreaMin: '50',
      floorAreaMax: '100',
    },
  };

  // Mock the listings data from the database
  const mockListings = [
    { price: 1500, typology: 'apartment', address: { city: 'New York' }, floorArea: 80 },
    { price: 1800, typology: 'apartment', address: { city: 'New York' }, floorArea: 90 },
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock function calls before each test
  });
  // Test cases for listings function
  describe('listings', () => {
    it('should return filtered listings when valid query parameters are provided', async () => {
      // Mock the find method of Listing model to return mockListings
      Listing.find = jest.fn().mockResolvedValue(mockListings);

      await listings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ listings: mockListings });
    });

    it('should return an empty array when no listings match the filter criteria', async () => {
      // Mock the find method of Listing model to return an empty array
      Listing.find = jest.fn().mockResolvedValue([]);

      await listings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ listings: [] });
    });

    it('should handle errors and return 500 status code with an error message', async () => {
      // Mock the find method of Listing model to throw an error
      Listing.find = jest.fn().mockRejectedValue(new Error('Database error'));

      await listings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving listings', error: 'Database error' });
    });
  });
});

describe('getListingById', () => {

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  it('should return a listing when a valid ID is provided', async () => {
      // Mock the listing ID
      const id = 'validId';

      // Mock the listing data from the database
      const mockListing = { _id: id, price: 1500, typology: 'apartment', address: { city: 'New York' }, floorArea: 80 };

      // Mock the findById method of Listing model to return the mockListing
      Listing.findById = jest.fn().mockResolvedValue(mockListing);

      // Mock the request object with params
      const req = { params: { id: id } };

      await getListingById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ listing: mockListing });
  });

  it('should return 400 status code when no listing is found with the provided ID', async () => {
      // Mock the listing ID
      const id = 'invalidId';

      // Mock the findById method of Listing model to return null (no listing found)
      Listing.findById = jest.fn().mockResolvedValue(null);

      // Mock the request object with params
      const req = { params: { id: id } };

      await getListingById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Listing not found' });
  });

  it('should handle errors and return 500 status code with an error message', async () => {
      // Mock the listing ID
      const id = 'validId';

      // Mock the findById method of Listing model to throw an error
      Listing.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      // Mock the request object with params
      const req = { params: { id: id } };

      await getListingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving listing', error: 'Database error' });
  });
});

