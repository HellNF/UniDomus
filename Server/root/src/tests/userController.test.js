// userController.test.js

const { registerUser, authenticateUser } = require('../controllers/userController');
const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');
const { sendConfirmationEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');
const { generateRandomToken } = require('../utils/tokenUtils');
const { isEmailAlreadyRegistered, isUsernameAlreadyTaken, isEmailPendingRegistration, getUserByEmail } = require('../database/databaseQueries');

// Mock external modules
jest.mock('../models/userModel');
jest.mock('../models/tokenModel');
jest.mock('../services/emailService');
jest.mock('jsonwebtoken');
jest.mock('../utils/tokenUtils'); // Mock the token utilities
jest.mock('../database/databaseQueries'); // Mock the custom database query functions

describe('UserController', () => {
    const req = {
        body: {
            email: 'test@example.com',
            password: 'Password123!',
            username: 'testuser',
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementations
        generateRandomToken.mockReturnValue('random_token_string');
        isEmailAlreadyRegistered.mockResolvedValue(false);
        isUsernameAlreadyTaken.mockResolvedValue(false);
        isEmailPendingRegistration.mockResolvedValue(false);
        getUserByEmail.mockResolvedValue(null);
        sendConfirmationEmail.mockResolvedValue();
        UserModel.create.mockResolvedValue({
            _id: '1',
            email: req.body.email,
            username: req.body.username,
            attivo: false
        });
        TokenModel.create.mockResolvedValue({
            token: 'random_token'
        });
    });

    describe('registerUser', () => {


      // Test handling of exceptions during the user creation process
      it('should handle database errors and return 500 status', async () => {
        UserModel.create.mockRejectedValue(new Error('Database error'));

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'error', 
            reason: 'Internal server error'
        });



    });

    // Test behavior when email service fails
    it('should handle email service failure', async () => {
        sendConfirmationEmail.mockRejectedValue(new Error('Email service down'));

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'error', reason: 'Internal server error' });
    });



      // Test successful registration
      it('should successfully register a user', async () => {
          await registerUser(req, res);
  
          expect(UserModel.create).toHaveBeenCalledWith({
              email: req.body.email,
              password: req.body.password,
              username: req.body.username,
              attivo: false
          });
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: 'success' });
          expect(sendConfirmationEmail).toHaveBeenCalledWith(req.body.email, expect.any(String));
      });
  
      // Test handling of duplicate email registration
      it('should handle duplicate email registrations and return 400 status', async () => {
          isEmailAlreadyRegistered.mockResolvedValue(true);
  
          await registerUser(req, res);
  
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
              message: 'error',
              errors: expect.arrayContaining([{ field: 'email', message: 'Email already registered' }])
          });
      });

      // Test handling of duplicate email registration
      it('should handle duplicate email registrations and return 400 status', async () => {
        isUsernameAlreadyTaken.mockResolvedValue(true);

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'error',
            errors: expect.arrayContaining([{ field: 'username', message: 'Username already taken' }])
        });
    });
    // Test handling pending registration
    it('should handle pending email registrations and return 400 status', async () => {
      isEmailAlreadyRegistered.mockResolvedValue(true);
      isEmailPendingRegistration.mockResolvedValue(true);

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
          message: 'error',
          errors: expect.arrayContaining([{ field: 'email', message: 'Email already registered' },{ field: 'email', message: 'Email pending registration' }])
      });
  });

      it('should handle validation errors and return 400 status', async () => {
        isEmailAlreadyRegistered.mockResolvedValue(true); // Simulating username already taken

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
  
      // Test input validation for email
      it('should return 400 status for invalid email format', async () => {
          req.body.email = 'bademail'; // Invalid email format
          await registerUser(req, res);
  
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
              message: 'error',
              errors: expect.arrayContaining([{ field: 'email', message: 'Invalid email' }])
          });
      });
  
      // Test input validation for password strength
      it('should return 400 status for weak password', async () => {
          req.body.password = '123'; // Weak password
          await registerUser(req, res);
  
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
              message: 'error',
              errors: expect.arrayContaining([{ field: 'password', message: 'Weak password' }])
          });
      });
  
      
      // Test registration with missing required fields
      it('should return 400 status if required fields are missing', async () => {
          req.body = {
              email: '',  // Missing email
              password: '',  // Missing password
              username: ''  // Missing username
          };
  
          await registerUser(req, res);
  
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
              message: 'error',
              errors: expect.any(Array)
          });
      });
  });
  

  describe('authenticateUser', () => {
    // Test successful authentication and token issuance
    it('should authenticate a user and return a token', async () => {
        getUserByEmail.mockResolvedValue({
            _id: '1',
            email: req.body.email,
            isValidPassword: jest.fn().mockResolvedValue(true)
        });
        jwt.sign.mockReturnValue('valid_jwt_token');

        await authenticateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Token returned',
            token: 'valid_jwt_token',
            email: req.body.email,
            id: '1',
            self: 'api/users/authentication/1'
        });
    });

    // Test invalid password
    it('should return 400 status if the password is incorrect', async () => {
        getUserByEmail.mockResolvedValue({
            email: req.body.email,
            isValidPassword: jest.fn().mockResolvedValue(false)
        });

        await authenticateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Wrong password'
        });
    });

    it('should handle user not found and return 401 status', async () => {
      getUserByEmail.mockResolvedValue(null);

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'User not found'
      });
  });
    

    // Test user not found
    it('should handle user not found and return 401 status', async () => {
        getUserByEmail.mockResolvedValue(null);

        await authenticateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'User not found'
        });
    });

    // Test database errors during user lookup
    it('should handle database errors during user lookup and return 500 status', async () => {
        getUserByEmail.mockRejectedValue(new Error('Database error'));

        await authenticateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });
    });

    

    // Test successful login but email service failure during token send (if applicable)
    it('should handle email service failure during notification after successful login', async () => {
        getUserByEmail.mockResolvedValue({
            _id: '1',
            email: req.body.email,
            isValidPassword: jest.fn().mockResolvedValue(true)
        });
        jwt.sign.mockReturnValue('valid_jwt_token');
        // Assuming there's a notification function that might fail
        sendConfirmationEmail.mockRejectedValue(new Error('Email service failure'));

        await authenticateUser(req, res);

        // Check if user is still logged in successfully
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Token returned',
            token: 'valid_jwt_token',
            email: req.body.email,
            id: '1',
            self: 'api/users/authentication/1'
        });
        
    });
});

});
