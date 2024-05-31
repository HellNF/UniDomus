// Import necessary modules and services
const request = require('supertest');
const app = require('../../app.js'); 
const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');
const ListingModel = require('../models/listingModel');
const tokenUtils = require('../utils/tokenUtils'); 
const emailService = require('../services/emailService'); 
const databaseQueries = require('../database/databaseQueries'); 
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const NotificationModel = require('../models/notificationModel'); 
const { notificationPriorityEnum} = require('../models/enums');


// Mock external modules as necessary
jest.mock('../models/userModel');
jest.mock('../models/tokenModel');
jest.mock('../services/emailService');
jest.mock('../utils/tokenUtils');
jest.mock('../database/databaseQueries');

// Mock the tokenChecker middleware
jest.mock('../middleware/tokenChecker', () => (req, res, next) => {
    req.userId = 'testUserId'; // Mock user ID or other relevant data
    next();
});

describe('UserController', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks

        // Setup default mock returns
        jest.spyOn(tokenUtils, 'generateRandomToken').mockReturnValue('random_token_string');
        jest.spyOn(databaseQueries, 'isEmailAlreadyRegistered').mockResolvedValue(false);
        jest.spyOn(databaseQueries, 'isUsernameAlreadyTaken').mockResolvedValue(false);
        jest.spyOn(databaseQueries, 'isEmailPendingRegistration').mockResolvedValue(false);
        jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(null);
        jest.spyOn(UserModel, 'create').mockResolvedValue({
            _id: '1',
            email: 'test@example.com',
            password: 'Password123!',
            username: 'testuser',
            active: false
        });
        jest.spyOn(TokenModel, 'create').mockResolvedValue({
            token: 'random_token_string'
        });
    });

    describe('POST /api/users/registration', () => {

        it('should successfully register a user', async () => {
            const response = await request(app)
                .post('/api/users/registration')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                    username: 'testuser'
                });

            expect(UserModel.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'Password123!',
                username: 'testuser',
                active: false
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'success' });
        });

        it('should handle duplicate email registrations and return 400 status', async () => {
            jest.spyOn(databaseQueries, 'isEmailAlreadyRegistered').mockResolvedValue(true);

            const response = await request(app)
                .post('/api/users/registration')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                    username: 'testuser'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'email', message: 'Email already registered' }]
            });
        });

        it('should return 400 status for invalid email format', async () => {
            const response = await request(app)
                .post('/api/users/registration')
                .send({
                    email: 'bademail',
                    password: 'Password123!',
                    username: 'testuser'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'email', message: 'Invalid email' }]
            });
        });

        it('should return 400 status for invalid password', async () => {
            const response = await request(app)
                .post('/api/users/registration')
                .send({
                    email: 'test@example.com',
                    password: '123',
                    username: 'testuser'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'password', message: 'Invalid password' }]
            });
        });

        it('should handle database errors and return 500 status', async () => {
            jest.spyOn(UserModel, 'create').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/users/registration')
                .send({
                    email: 'valid.email@example.com',
                    password: 'ValidPassword123!',
                    username: 'validUsername'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'error',
                reason: 'Internal server error'
            });
        });
    });

    describe('POST /api/users/authentication', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Reset all mocks

            jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(null);
            jest.spyOn(jwt, 'sign').mockReturnValue('fake_jwt_token');
        });

        it('should authenticate a user and return a token', async () => {
            const userMock = {
                _id: '1',
                email: 'test@example.com',
                isValidPassword: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(userMock);

            const response = await request(app)
                .post('/api/users/authentication')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(databaseQueries.getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(userMock.isValidPassword).toHaveBeenCalledWith('Password123!');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Token returned',
                token: 'fake_jwt_token',
                email: 'test@example.com',
                id: '1',
                self: 'api/users/authentication/1'
            });
        });

        it('should return 401 status if the password is incorrect', async () => {
            const userMock = {
                email: 'test@example.com',
                isValidPassword: jest.fn().mockResolvedValue(false)
            };

            jest.spyOn(databaseQueries, 'getUserByEmail').mockResolvedValue(userMock);

            const response = await request(app)
                .post('/api/users/authentication')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword123!'
                });

            expect(userMock.isValidPassword).toHaveBeenCalledWith('WrongPassword123!');
            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Wrong password'
            });
        });

        it('should handle user not found and return 401 status', async () => {
            const response = await request(app)
                .post('/api/users/authentication')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'User not found'
            });
        });

        it('should handle database errors during user lookup and return 500 status', async () => {
            jest.spyOn(databaseQueries, 'getUserByEmail').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/users/authentication')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Internal server error'
            });
        });
    });

    describe('GET /api/users/tags', () => {
        it('should return tags', async () => {
            const response = await request(app)
                .get('/api/users/tags');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                hobbies: expect.any(Array),
                habits: expect.any(Array)
            });
        });
    });

    describe('GET /api/users/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(UserModel, 'findById').mockResolvedValue({
                _id: '1',
                username: 'testUser',
                email: 'test@example.com',
                hobbies: ['reading', 'gaming'],
                proPic: ['pic1', 'pic2']
            });
        });

        it('should retrieve a user by ID and return successfully', async () => {
            const response = await request(app)
                .get('/api/users/1');

            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                user: {
                    _id: '1',
                    username: 'testUser',
                    email: 'test@example.com',
                    hobbies: ['reading', 'gaming'],
                    proPic: []
                }
            });
        });

        it('should handle the case when no user is found', async () => {
            jest.spyOn(UserModel, 'findById').mockResolvedValue(null);

            const response = await request(app)
                .get('/api/users/1');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'User not found' });
        });

        it('should handle database errors and return 500 status', async () => {
            jest.spyOn(UserModel, 'findById').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/users/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'Error retrieving user',
                error: 'Database error'
            });
        });
    });

    describe('PUT /api/users/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should update user details and return updated user', async () => {
            const mockUser = {
                _id: '1',
                username: 'updatedUser',
                email: 'update@example.com',
                proPic: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
            };
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/api/users/1')
                .set('x-access-token', 'valid_token') // Mock token
                .send({
                    username: 'updatedUser',
                    email: 'update@example.com'
                });

            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('1', {
                username: 'updatedUser',
                email: 'update@example.com'
            }, { new: true });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ user: mockUser });
        });

        it('should handle "proPic=true" and return all profile pictures', async () => {
            const mockUser = {
                _id: '1',
                username: 'updatedUser',
                email: 'update@example.com',
                proPic: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
            };
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/api/users/1')
                .query({ proPic: 'true' })
                .set('x-access-token', 'valid_token') // Mock token
                .send({
                    username: 'updatedUser',
                    email: 'update@example.com'
                });

            expect(response.body.user.proPic).toEqual(['pic1.jpg', 'pic2.jpg', 'pic3.jpg']);
        });

        it('should handle "proPic=false" and remove all profile pictures', async () => {
            const mockUser = {
                _id: '1',
                username: 'updatedUser',
                email: 'update@example.com',
                proPic: []
            };
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/api/users/1')
                .query({ proPic: 'false' })
                .set('x-access-token', 'valid_token') // Mock token
                .send({
                    username: 'updatedUser',
                    email: 'update@example.com'
                });

            expect(response.body.user.proPic).toEqual([]);
        });

        it('should handle "proPic=2" and return two profile pictures', async () => {
            const mockUser = {
                _id: '1',
                username: 'updatedUser',
                email: 'update@example.com',
                proPic: ['pic1.jpg', 'pic2.jpg']
            };
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/api/users/1')
                .query({ proPic: '2' })
                .set('x-access-token', 'valid_token') // Mock token
                .send({
                    username: 'updatedUser',
                    email: 'update@example.com'
                });

            expect(response.body.user.proPic.length).toBe(2);
        });

        it('should return 404 if user not found', async () => {
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(null);

            const response = await request(app)
                .put('/api/users/1')
                .set('x-access-token', 'valid_token') // Mock token
                .send({
                    username: 'updatedUser',
                    email: 'update@example.com'
                });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'User not found' });
        });

        it('should handle database errors and return 500 status', async () => {
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/users/1')
                .set('x-access-token', 'valid_token') // Mock token
                .send({
                    username: 'updatedUser',
                    email: 'update@example.com'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'Error updating user',
                error: 'Database error'
            });
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete the user and associated listing successfully', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1'
            };

            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(ListingModel, 'findByIdAndDelete').mockResolvedValue({});
            jest.spyOn(UserModel, 'findByIdAndDelete').mockResolvedValue(mockUser);
            jest.spyOn(emailService, 'sendUserDeletedEmail').mockResolvedValue({});

            const response = await request(app)
                .delete('/api/users/1')
                .set('x-access-token', 'valid_token'); // Mock token

            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(ListingModel.findByIdAndDelete).toHaveBeenCalledWith('listing1');
            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(emailService.sendUserDeletedEmail).toHaveBeenCalledWith('test@example.com');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "User and associated listing (if any) deleted successfully" });
        });

        it('should handle case where user is not found', async () => {
            jest.spyOn(UserModel, 'findById').mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/users/1')
                .set('x-access-token', 'valid_token'); // Mock token

            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'User not found' });
        });

        it('should handle database errors during user deletion', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1'
            };

            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(ListingModel, 'findByIdAndDelete').mockResolvedValue({});
            jest.spyOn(UserModel, 'findByIdAndDelete').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .delete('/api/users/1')
                .set('x-access-token', 'valid_token'); // Mock token

            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error', error: 'Database error' });
        });

        it('should handle errors during listing deletion but still delete the user', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1'
            };

            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(ListingModel, 'findByIdAndDelete').mockRejectedValue(new Error('Listing deletion error'));
            jest.spyOn(UserModel, 'findByIdAndDelete').mockResolvedValue(mockUser);
            jest.spyOn(emailService, 'sendUserDeletedEmail').mockResolvedValue({});

            const response = await request(app)
                .delete('/api/users/1')
                .set('x-access-token', 'valid_token'); // Mock token

            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(ListingModel.findByIdAndDelete).toHaveBeenCalledWith('listing1');
            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(emailService.sendUserDeletedEmail).toHaveBeenCalledWith('test@example.com');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "User and associated listing (if any) deleted successfully" });
        });
    });

    describe('POST /api/users/auth/google', () => {
        let mockVerifyIdToken;

        beforeEach(() => {
            jest.clearAllMocks();
            mockVerifyIdToken = jest.fn();
        });

        jest.mock('google-auth-library', () => {
        return {
            OAuth2Client: jest.fn(() => ({
            verifyIdToken: mockVerifyIdToken,
            })),
        };
        });
        
    
        it('should authenticate user with valid token and return JWT', async () => {
            const mockGoogleId = '1234567890';
            const mockEmail = 'test@example.com';
            const mockPicture = 'http://example.com/picture.jpg';
            const mockName = 'Test';
            const mockSurname = 'User';
            const mockToken = 'mockGoogleIdToken';
    
            // Mock the Google token verification
            mockVerifyIdToken.mockResolvedValue({
                getPayload: () => ({
                    sub: mockGoogleId,
                    email: mockEmail,
                    picture: mockPicture,
                    given_name: mockName,
                    family_name: mockSurname,
                }),
            });
    
            // Mock the User.findOne method
            UserModel.findOne = jest.fn()
                .mockResolvedValueOnce(null) // First call for email
                .mockResolvedValueOnce({
                    id: 'mockUserId',
                    email: mockEmail,
                    username: 'test',
                    save: jest.fn(),
                }); // Second call for googleId
    
            // Mock the User.create method
            UserModel.create = jest.fn().mockResolvedValue({
                id: 'mockUserId',
                email: mockEmail,
                username: 'test',
                name: mockName,
                surname: mockSurname,
                proPic: [mockPicture],
                active: true,
            });
    
            const response = await request(app)
                .post('/api/users/auth/google')
                .send({ token: mockToken });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
    
            // Verifica che il JWT sia stato generato correttamente
            const decoded = jwt.verify(response.body.token, process.env.SUPER_SECRET);
            expect(decoded).toMatchObject({
                id: 'mockUserId',
                email: mockEmail,
                username: 'test',
            });
        });
    
        it('should return 500 if there is an internal server error', async () => {
            const mockToken = 'mockGoogleIdToken';
    
            // Mock the Google token verification to throw an error
            mockVerifyIdToken.mockRejectedValue(new Error('Internal server error'));
    
            const response = await request(app)
                .post('/api/users/auth/google')
                .send({ token: mockToken });
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/users/banned', () => {
        it('should return a list of banned users', async () => {
            const banTime = new Date(Date.now() + 3600 * 1000) 
            const mockUsers = [
                { _id: '1', email: 'user1@example.com', ban: { banPermanently: true } },
                { _id: '2', email: 'user2@example.com', ban: { banTime: banTime.toString()} }
            ];
    
            jest.spyOn(UserModel, 'find').mockResolvedValue(mockUsers);
    
            const response = await request(app).get('/api/users/ban');
    
            console.log('Response status:', response.status);
            console.log('Response body:', response.body);
    
            expect(response.status).toBe(200);
            expect(response.body.users).toEqual([{"_id": "1",
             "ban": {"banPermanently": true},
             "email": "user1@example.com"},
             {"_id": "2",
             "ban": {"banTime": banTime.toString()},
             "email": "user2@example.com"
            }]);
        });
    
        it('should return an empty list if no banned users are found', async () => {
            jest.spyOn(UserModel, 'find').mockResolvedValue([]);
    
            const response = await request(app).get('/api/users/ban');
    
            console.log('Response status:', response.status);
            console.log('Response body:', response.body);
    
            expect(response.status).toBe(200);
            expect(response.body.users).toEqual([]);
            expect(response.body.message).toBe("No banned users found");
        });
    
        it('should return 500 if there is an internal server error', async () => {
            jest.spyOn(UserModel, 'find').mockRejectedValue(new Error('Database error'));
    
            const response = await request(app).get('/api/users/ban');
    
            console.log('Response status:', response.status);
            console.log('Response body:', response.body);
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error retrieving banned users');
            expect(response.body.error).toBe('Database error');
        });
    });
    describe('PUT /api/users/:id/ban', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it('should ban a user and their listing for a specified duration', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1',
                ban: { prevBanNum: 2 }
            };
    
            const mockListing = {
                _id: 'listing1',
                ban: {}
            };
    
            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockUser,
                ban: {
                    banTime: new Date(Date.now() + (3600 + 7200) * 1000),
                    banPermanently: false,
                    prevBanNum: 3
                }
            });
    
            jest.spyOn(ListingModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockListing,
                ban: {
                    banTime: new Date(Date.now() + (3600 + 7200) * 1000),
                    banPermanently: false
                }
            });
    
            jest.spyOn(emailService, 'sendUserBannedEmail').mockResolvedValue({});
    
            const response = await request(app)
                .put('/api/users/1/ban')
                .send({ banTimeInSeconds: 3600, banPermanently: false });
    
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $set: { 
                    'ban.banTime': expect.any(Date), 
                    'ban.banPermanently': false,
                    'ban.prevBanNum': 3 
                }},
                { new: true, runValidators: true }
            );
    
            expect(ListingModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'listing1',
                { $set: { 
                    'ban.banTime': expect.any(Date), 
                    'ban.banPermanently': false 
                }},
                { new: true, runValidators: true }
            );
    
            expect(emailService.sendUserBannedEmail).toHaveBeenCalledWith(
                'test@example.com',
                3600,
                false,
                3
            );
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "User and associated listing banned successfully",
                userBan: {
                    banTime: expect.any(String),
                    banPermanently: false,
                    prevBanNum: 3
                },
                listingBan: {
                    banTime: expect.any(String),
                    banPermanently: false
                }
            });
        });
    
        it('should ban a user and their listing permanently', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1',
                ban: { prevBanNum: 2 }
            };
    
            const mockListing = {
                _id: 'listing1',
                ban: {}
            };
    
            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockUser,
                ban: {
                    banTime: null,
                    banPermanently: true,
                    prevBanNum: 3
                }
            });
    
            jest.spyOn(ListingModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockListing,
                ban: {
                    banTime: null,
                    banPermanently: true
                }
            });
    
            jest.spyOn(emailService, 'sendUserBannedEmail').mockResolvedValue({});
    
            const response = await request(app)
                .put('/api/users/1/ban')
                .send({ banPermanently: true });
    
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $set: { 
                    'ban.banPermanently': true,
                    'ban.banTime': null,
                    'ban.prevBanNum': 3 
                }},
                { new: true, runValidators: true }
            );
    
            expect(ListingModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'listing1',
                { $set: { 
                    'ban.banPermanently': true,
                    'ban.banTime': null 
                }},
                { new: true, runValidators: true }
            );
    
            expect(emailService.sendUserBannedEmail).toHaveBeenCalledWith(
                'test@example.com',
                undefined,
                true,
                3
            );
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "User and associated listing banned successfully",
                userBan: {
                    banTime: null,
                    banPermanently: true,
                    prevBanNum: 3
                },
                listingBan: {
                    banTime: null,
                    banPermanently: true
                }
            });
        });
    
        it('should return 404 if user is not found', async () => {
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(null);
    
            const response = await request(app)
                .put('/api/users/1/ban')
                .send({ banTimeInSeconds: 3600, banPermanently: false });
    
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "User not found" });
        });
    
        it('should return 500 on internal server error', async () => {
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));
    
            const response = await request(app)
                .put('/api/users/1/ban')
                .send({ banTimeInSeconds: 3600, banPermanently: false });
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Internal server error", error: 'Database error' });
        });
    
        it('should return 400 for invalid ban time', async () => {
            const response = await request(app)
                .put('/api/users/1/ban')
                .send({ banTimeInSeconds: -1, banPermanently: false });
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Invalid ban time provided" });
        });
    });

    describe('PUT /api/users/:id/unban', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it('should unban a user and their listing, and create a notification', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1',
                ban: { banPermanently: true, prevBanNum: 3 }
            };
    
            const mockListing = {
                _id: 'listing1',
                ban: { banPermanently: true }
            };
    
            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockUser,
                ban: {}
            });
            jest.spyOn(ListingModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockListing,
                ban: {}
            });
            jest.spyOn(NotificationModel, 'create').mockResolvedValue({});
    
            const response = await request(app)
                .put('/api/users/1/unban')
                .send();
    
            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $unset: { 'ban.banTime': '', 'ban.banPermanently': '' } },
                { new: true }
            );
            expect(ListingModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'listing1',
                { $unset: { 'ban.banTime': '', 'ban.banPermanently': '' } },
                { new: true }
            );
            expect(NotificationModel.create).toHaveBeenCalledWith({
                userID: mockUser._id,
                type: "alert",
                message: `You have been recently unbanned`,
                link: `/`,
                priority: notificationPriorityEnum.MEDIUM
            });
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "User and associated listing unbanned successfully"
            });
        });


    
        it('should return 404 if user is not found', async () => {
            jest.spyOn(UserModel, 'findById').mockResolvedValue(null);
    
            const response = await request(app)
                .put('/api/users/1/unban')
                .send();
    
            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "User not found" });
        });
    
        it('should return 400 if user is not banned', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                listingID: 'listing1',
                ban: { banPermanently: false, banTime: new Date(Date.now() - 3600 * 1000) }
            };
    
            jest.spyOn(UserModel, 'findById').mockResolvedValue(mockUser);
    
            const response = await request(app)
                .put('/api/users/1/unban')
                .send();
    
            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "User is not banned" });
        });
    
        it('should return 500 if there is an internal server error', async () => {
            jest.spyOn(UserModel, 'findById').mockRejectedValue(new Error('Database error'));
    
            const response = await request(app)
                .put('/api/users/1/unban')
                .send();
    
            expect(UserModel.findById).toHaveBeenCalledWith('1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Error unbanning user and listing", error: 'Database error' });
        });
    });
    
});
