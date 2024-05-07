// tokenController.test.js

const { confirmToken } = require('../controllers/tokenController');
const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const { isEmailSuccessfullyConfirmed } = require('../database/databaseQueries');

jest.mock('../models/tokenModel');
jest.mock('../models/userModel');
jest.mock('../database/databaseQueries');

describe('TokenController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                token: 'valid_token'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn()
        };

        // Environment variable setup
        process.env.FRONTEND_BASE = 'http://localhost:3000';
    });

    it('should confirm a valid token and update user status', async () => {
        isEmailSuccessfullyConfirmed.mockResolvedValue('user_id');
        User.findByIdAndUpdate.mockResolvedValue({ _id: 'user_id', active: true });
        Token.findOneAndDelete.mockResolvedValue({ token: 'valid_token' });

        await confirmToken(req, res);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user_id', { $set: { active: true } }, { new: true });
        expect(Token.findOneAndDelete).toHaveBeenCalledWith({ token: 'valid_token' });
        expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/login');
    });

    it('should handle invalid tokens by returning an error', async () => {
        isEmailSuccessfullyConfirmed.mockResolvedValue(null);
        Token.findOne.mockResolvedValue(null); // Simulating no token found

        await confirmToken(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "error", reason: "Invalid token" });
    });

    it('should handle database errors during user update', async () => {
        isEmailSuccessfullyConfirmed.mockResolvedValue('user_id');
        User.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

        await confirmToken(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "error", reason: "Internal server error" });
    });

    it('should return an error for expired tokens', async () => {
        isEmailSuccessfullyConfirmed.mockResolvedValue(null);
        Token.findOne.mockResolvedValue({
            token: 'expired_token',
            expirationDate: new Date(Date.now() - 10000) // Date in the past
        });

        await confirmToken(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "error", reason: "Expired token" });
    });


});

