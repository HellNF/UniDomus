// matchController.test.js

const request = require('supertest');
const app = require('../../app.js'); 
const MatchModel = require('../models/matchModel');
const UserModel = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');
const { matchStatusEnum, notificationPriorityEnum, matchTypeEnum } = require('../models/enums');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });

jest.mock('../models/matchModel'); // Mock the Match model for testing
jest.mock('../models/userModel'); // Mock the User model for testing
jest.mock('../models/notificationModel'); // Mock the Notification model for testing

jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());

describe('Match Controller', () => {
    let token;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test

        // Generate a valid JWT token for testing
        token = jwt.sign({ id: 'testUserId' }, process.env.SUPER_SECRET, { expiresIn: '1h' });
    });

    describe('POST /api/matches', () => {
        it('should create a match successfully', async () => {
            const mockRequester = { _id: 'requesterID', name: 'John', surname: 'Doe' };
            const mockReceiver = { _id: 'receiverID' };
            const mockMatch = { _id: 'matchId', requesterID: 'requesterID', receiverID: 'receiverID', matchType: 'Coinquilino', matchStatus: matchStatusEnum.PENDING };

            UserModel.findById.mockResolvedValueOnce(mockRequester).mockResolvedValueOnce(mockReceiver);
            MatchModel.create.mockResolvedValue(mockMatch);
            NotificationModel.create.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/matches')
                .set('x-access-token', `${token}`)
                .send({
                    requesterID: 'requesterID',
                    receiverID: 'receiverID',
                    matchType: 'Coinquilino'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Match created successfully', match: mockMatch });
        });

        it('should return 404 if requester or receiver is not found', async () => {
            UserModel.findById.mockResolvedValueOnce(null);

            const response = await request(app)
                .post('/api/matches')
                .set('x-access-token', `${token}`)
                .send({
                    requesterID: 'requesterID',
                    receiverID: 'receiverID',
                    matchType: 'Coinquilino'
                });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'One or both users not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            UserModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/matches')
                .set('x-access-token', `${token}`)
                .send({
                    requesterID: 'requesterID',
                    receiverID: 'receiverID',
                    matchType: 'Coinquilino'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/matches/user/:userID', () => {
        it('should retrieve matches by user ID', async () => {
            const mockMatches = [
                { _id: 'match1', requesterID: 'requesterID', receiverID: 'receiverID', matchType: 'Coinquilino', matchStatus: matchStatusEnum.PENDING }
            ];

            MatchModel.find.mockResolvedValue(mockMatches);

            const response = await request(app)
                .get('/api/matches/user/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ matches: mockMatches });
        });

        it('should handle errors and return 500 status code', async () => {
            MatchModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/matches/user/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/matches/received/:userID', () => {
        it('should retrieve matches received by user', async () => {
            const mockMatches = [
                { _id: 'match1', requesterID: 'requesterID', receiverID: 'testUserId', matchType: 'Coinquilino', matchStatus: matchStatusEnum.PENDING }
            ];

            MatchModel.find.mockResolvedValue(mockMatches);

            const response = await request(app)
                .get('/api/matches/received/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ matches: mockMatches });
        });

        it('should handle errors and return 500 status code', async () => {
            MatchModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/matches/received/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/matches/sent/:userID', () => {
        it('should retrieve matches sent by user', async () => {
            const mockMatches = [
                { _id: 'match1', requesterID: 'testUserId', receiverID: 'receiverID', matchType: 'Coinquilino', matchStatus: matchStatusEnum.PENDING }
            ];

            MatchModel.find.mockResolvedValue(mockMatches);

            const response = await request(app)
                .get('/api/matches/sent/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ matches: mockMatches });
        });

        it('should handle errors and return 500 status code', async () => {
            MatchModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/matches/sent/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('PUT /api/matches/status/:matchID', () => {
    it('should update match status successfully', async () => {
        const mockMatch = { _id: 'matchId',receiverID: "receiverID",requesterID:"requesterID",matchType: matchTypeEnum.APARTMENT, matchStatus: matchStatusEnum.PENDING };

        MatchModel.findById.mockResolvedValue(mockMatch);
        MatchModel.findByIdAndUpdate.mockResolvedValue({ ...mockMatch, matchStatus: matchStatusEnum.ACCEPTED });

        const response = await request(app)
            .put('/api/matches/status/matchId')
            .set('x-access-token', `${token}`)
            .send({ matchStatus: matchStatusEnum.ACCEPTED });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: `Match status updated to ${matchStatusEnum.ACCEPTED}`, match: { ...mockMatch, matchStatus: matchStatusEnum.ACCEPTED } });
    });

    it('should return 404 if match is not found', async () => {
        MatchModel.findById.mockResolvedValue(null);

        const response = await request(app)
            .put('/api/matches/status/matchId')
            .set('x-access-token', `${token}`)
            .send({ matchStatus: matchStatusEnum.ACCEPTED });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Match not found' });
    });

    it('should handle errors and return 500 status code', async () => {
        MatchModel.findById.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put('/api/matches/status/matchId')
            .set('x-access-token', `${token}`)
            .send({ matchStatus: matchStatusEnum.ACCEPTED });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});

    describe('POST /api/matches/:matchID/messages', () => {
        it('should add a message to match successfully', async () => {
            const mockUser = { _id: 'testUserId' };
            const mockMatch = { _id: 'matchId', messages: [] };

            UserModel.findById.mockResolvedValue(mockUser);
            MatchModel.findById.mockResolvedValue(mockMatch);
            mockMatch.messages.push = jest.fn();

            const response = await request(app)
                .post('/api/matches/matchId/messages')
                .set('x-access-token', `${token}`)
                .send({ text: "Hello!", userID: "testUserId" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Message added successfully', match: mockMatch });
        });

        it('should return 404 if user is not found', async () => {
            UserModel.findById.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/matches/matchId/messages')
                .set('x-access-token', `${token}`)
                .send({ text: 'Hello!', userID: 'testUserId' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'User not found' });
        });

        it('should return 404 if match is not found', async () => {
            UserModel.findById.mockResolvedValue({ _id: 'testUserId' });
            MatchModel.findById.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/matches/matchId/messages')
                .set('x-access-token', `${token}`)
                .send({ text: 'Hello!', userID: 'testUserId' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Match not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            UserModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/matches/matchId/messages')
                .set('x-access-token', `${token}`)
                .send({ text: 'Hello!', userID: 'testUserId' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('DELETE /api/matches/:matchID', () => {
        it('should delete a match successfully', async () => {
            MatchModel.findByIdAndDelete.mockResolvedValue({ _id: 'matchId' });

            const response = await request(app)
                .delete('/api/matches/matchId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Match deleted successfully' });
        });

        it('should return 404 if match is not found', async () => {
            MatchModel.findByIdAndDelete.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/matches/matchId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Match not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            MatchModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .delete('/api/matches/matchId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/matches/:matchID', () => {
        it('should retrieve a match by ID successfully', async () => {
            const mockMatch = { _id: 'matchId', requesterID: 'requesterID', receiverID: 'receiverID', matchType: 'Coinquilino', matchStatus: matchStatusEnum.PENDING };

            MatchModel.findById.mockResolvedValue(mockMatch);

            const response = await request(app)
                .get('/api/matches/matchId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ match: mockMatch });
        });

        it('should return 404 if match is not found', async () => {
            MatchModel.findById.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/matches/matchId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Match not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            MatchModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/matches/matchId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('PUT /api/matches/:matchID', () => {
        it('should update match details successfully', async () => {
            const mockMatch = { _id: 'matchId', requesterID: 'requesterID', receiverID: 'receiverID', matchType: 'Coinquilino', matchStatus: matchStatusEnum.PENDING };

            MatchModel.findByIdAndUpdate.mockResolvedValue(mockMatch);

            const response = await request(app)
                .put('/api/matches/matchId')
                .set('x-access-token', `${token}`)
                .send({ matchType: 'Appartamento' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Match updated successfully', match: mockMatch });
        });

        it('should return 404 if match is not found', async () => {
            MatchModel.findByIdAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/matches/matchId')
                .set('x-access-token', `${token}`)
                .send({ matchType: 'Appartamento' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Match not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            MatchModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/matches/matchId')
                .set('x-access-token', `${token}`)
                .send({ matchType: 'Appartamento' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });
});
