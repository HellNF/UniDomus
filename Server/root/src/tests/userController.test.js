
// Import necessary modules and services
const { registerUser,authenticateUser,getTags,getUserById,updateUserById  } = require('../controllers/userController');
const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');
const tokenUtils = require('../utils/tokenUtils'); 
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService'); 
const databaseQueries = require('../database/databaseQueries'); 
const validators = require('../validators/validationFunctions');

// Mock external modules as necessary
jest.mock('../models/userModel');
jest.mock('../models/tokenModel');
jest.mock('../services/emailService');
jest.mock('../utils/tokenUtils');
jest.mock('../database/databaseQueries');

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
        jest.clearAllMocks(); // Reset all mocks

        // Setup default mock returns
        jest.spyOn(tokenUtils, 'generateRandomToken').mockReturnValue('random_token_string');
        jest.spyOn(databaseQueries, 'isEmailAlreadyRegistered').mockResolvedValue(false);
        jest.spyOn(databaseQueries, 'isUsernameAlreadyTaken').mockResolvedValue(false);
        jest.spyOn(databaseQueries, 'isEmailPendingRegistration').mockResolvedValue(false);
        jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(null);
        jest.spyOn(emailService, 'sendConfirmationEmail').mockResolvedValue();
        jest.spyOn(UserModel, 'create').mockResolvedValue({
            _id: '1',
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            active: false
        });
        jest.spyOn(TokenModel, 'create').mockResolvedValue({
            token: 'random_token_string'
        });
    });

    describe('POST api/users/registration', () => {

    // Test successful registration
    it('should successfully register a user', async () => {
        await registerUser(req, res);

        expect(UserModel.create).toHaveBeenCalledWith({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            active: false
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'success' });
        expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith(req.body.email, expect.any(String));
    });

    // Test handling of duplicate email registrations
    it('should handle duplicate email registrations and return 400 status', async () => {
        jest.spyOn(databaseQueries, 'isEmailAlreadyRegistered').mockResolvedValue(true);

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'error',
            errors: expect.arrayContaining([{ field: 'email', message: 'Email already registered' }])
        });
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
    it('should return 400 status for invalid password', async () => {
        req.body.password = '123'; // Weak password

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'error',
            errors: expect.arrayContaining([{ field: 'password', message: 'Invalid password' }])
        });
    });

    // Test handling of exceptions during the user creation process
    it('should handle database errors and return 500 status', async () => {
  
    req.body.email = 'valid.email@example.com';
    req.body.password = 'ValidPassword123!';
    req.body.username = 'validUsername';

        
        jest.spyOn(UserModel, 'create').mockRejectedValue(new Error('Database error'));

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'error', 
            reason: 'Internal server error'
        });
    });
});

describe('POST api/users/authentication', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks

        jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(null);
        jest.spyOn(jwt, 'sign').mockReturnValue('fake_jwt_token');
    });

    //test succesful authentication
    it('should authenticate a user and return a token', async () => {
        const userMock = {
            _id: '1',
            email: 'test@example.com',
            isValidPassword: jest.fn().mockResolvedValue(true)
        };

        jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(userMock);
        
        const req = {
            body: {
                email: 'test@example.com',
                password: 'Password123!'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await authenticateUser(req, res);

        expect(databaseQueries.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(userMock.isValidPassword).toHaveBeenCalledWith('Password123!');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Token returned',
            token: 'fake_jwt_token',
            email: 'test@example.com',
            id: '1',
            self: 'api/users/authentication/1'
        });
    });

    //test wrong password error
    it('should return 401 status if the password is incorrect', async () => {
        const userMock = {
            email: 'test@example.com',
            isValidPassword: jest.fn().mockResolvedValue(false)
        };

        jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(userMock);

        const req = {
            body: {
                email: 'test@example.com',
                password: 'WrongPassword123!'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await authenticateUser(req, res);

        expect(userMock.isValidPassword).toHaveBeenCalledWith('WrongPassword123!');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Wrong password'
        });
    });

    //test user not found error
    it('should handle user not found and return 401 status', async () => {
        jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(null);

        const req = {
            body: {
                email: 'nonexistent@example.com',
                password: 'Password123!'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await authenticateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'User not found'
        });
    });

    // Test handling of exceptions during authentication
    it('should handle database errors during user lookup and return 500 status', async () => {
        jest.spyOn(databaseQueries, 'getUserByEmail').mockRejectedValue(new Error('Database error'));

        const req = {
            body: {
                email: 'test@example.com',
                password: 'Password123!'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await authenticateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error'
        });
    });

});

describe('GET api/users/tags', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();  
    });
 
    it('should return tags', async () => {

        await getTags(null, res); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            hobbies: expect.any(Array),
            habits: expect.any(Array)
          });
    });
});

describe('GET api/users/:id', () => {
    const req = {
        params: { id: '1' },
        query: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Spy on UserModel.findById
        jest.spyOn(UserModel, 'findById').mockResolvedValue({
            _id: '1',
            username: 'testUser',
            email: 'test@example.com',
            hobbies: ['reading', 'gaming'], 
            proPic: ['pic1', 'pic2'] 
        });
    });
 
    //test the user's successful retrieval
    it('should retrieve a user by ID and return successfully', async () => {
        await getUserById(req, res);

        expect(UserModel.findById).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: {
                _id: '1',
                username: 'testUser',
                email: 'test@example.com',
                hobbies: ['reading', 'gaming'],
                proPic: []
            }
        });
    });
    
    //test user not found error
    it('should handle the case when no user is found', async () => {
        jest.spyOn(UserModel, 'findById').mockResolvedValue(null);

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    // Test handling of database errors during findById function
    it('should handle database errors and return 500 status', async () => {
        jest.spyOn(UserModel, 'findById').mockRejectedValue(new Error('Database error'));

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving user',
            error: 'Database error'
        });
    });
});

describe('PUT api/users/:id', () => {
    const req = {
        params: { id: '1' },
        body: {
            username: 'updatedUser',
            email: 'update@example.com'
        },
        query: {}  
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        req.query = {};  // Reset query parameters for each test
    });
     //test successful user update 
    it('should update user details and return updated user', async () => {
        const mockUser = {
            _id: '1',
            username: 'updatedUser',
            email: 'update@example.com',
            proPic: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
        };
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

        await updateUserById(req, res);

        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    //checks that all profile pictures are returned when 'proPic=true'
    it('should handle "proPic=true" and return all profile pictures', async () => {
        req.query.proPic = 'true';
        const mockUser = {
            _id: '1',
            username: 'updatedUser',
            email: 'update@example.com',
            proPic: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
        };
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

        await updateUserById(req, res);

        expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    //confirms that no profile pictures are returned when 'proPic=false'
    it('should handle "proPic=false" and remove all profile pictures', async () => {
        req.query.proPic = 'false';
        const mockUser = {
            _id: '1',
            username: 'updatedUser',
            email: 'update@example.com',
            proPic: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
        };
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

        await updateUserById(req, res);

        expect(mockUser.proPic).toEqual([]);
        expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    //ensures returning only two profile pictures when 'proPic=2
    it('should handle "proPic=2" and return two profile pictures', async () => {
        req.query.proPic = '2';
        const mockUser = {
            _id: '1',
            username: 'updatedUser',
            email: 'update@example.com',
            proPic: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
        };
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

        await updateUserById(req, res);

        expect(mockUser.proPic.length).toBe(2);
        expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    //ensures a 404 status is returned if the user is not found
    it('should return 404 if user not found', async () => {
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(null);

        await updateUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    //test that database errors are caught and a 500 status is returned
    it('should handle database errors and return 500 status', async () => {
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

        await updateUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error updating user',
            error: 'Database error'
        });
    });
});


});

