const { listings } = require('../controllers/listingController');
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
