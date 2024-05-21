const request = require('supertest');
const app = require('../../app.js'); 
const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const databaseQueries = require('../database/databaseQueries');
const { confirmToken } = require('../controllers/tokenController');

jest.mock('../models/tokenModel');
jest.mock('../models/userModel');
jest.mock('../database/databaseQueries');

describe('TokenController - confirmToken Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        jest.spyOn(User, 'findByIdAndUpdate').mockClear();
        jest.spyOn(Token, 'findOneAndDelete').mockClear();
        jest.spyOn(Token, 'findOne').mockClear();

        // Environment variable setup
        process.env.FRONTEND_BASE = 'http://localhost:5173';
    });

    it('should confirm a valid token and update user status', async () => {
        databaseQueries.isEmailSuccessfullyConfirmed.mockResolvedValue('user_id');
        User.findByIdAndUpdate.mockResolvedValue({ _id: 'user_id', active: true });
        Token.findOneAndDelete.mockResolvedValue({ token: 'valid_token' });

        const response = await request(app)
            .get('/api/tokens/valid_token');

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user_id', { $set: { active: true } }, { new: true });
        expect(Token.findOneAndDelete).toHaveBeenCalledWith({ token: 'valid_token' });
        expect(response.status).toBe(302); // Redirection status code
        expect(response.header.location).toBe('http://localhost:5173/login');
    });

    it('should return an error for invalid tokens', async () => {
        databaseQueries.isEmailSuccessfullyConfirmed.mockResolvedValue(null); // Token is invalid
        Token.findOne.mockResolvedValue(null); // No token found

        const response = await request(app)
            .get('/api/tokens/valid_token');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error", reason: "Invalid token" });
    });

    it('should handle database errors during user update', async () => {
        databaseQueries.isEmailSuccessfullyConfirmed.mockResolvedValue('user_id');
        User.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/tokens/valid_token');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "error", reason: "Internal server error" });
    });

    it('should return an error for expired tokens', async () => {
        databaseQueries.isEmailSuccessfullyConfirmed.mockResolvedValue(null);
        Token.findOne.mockResolvedValue({
            token: 'expired_token',
            expirationDate: new Date(Date.now() - 10000) // Date in the past
        });

        const response = await request(app)
            .get('/api/tokens/valid_token');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error", reason: "Expired token" });
    });
});
