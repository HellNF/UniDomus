// notificationController.test.js

const request = require('supertest');
const app = require('../../app.js'); 
const NotificationModel = require('../models/notificationModel');
const UserModel = require('../models/userModel');
const { notificationTypeEnum, notificationStatusEnum, notificationPriorityEnum } = require('../models/enums');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });

jest.mock('../models/userModel'); // Mock the User model for testing
jest.mock('../models/notificationModel'); // Mock the Notification model for testing

jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());

describe('Notification Controller', () => {
    let token;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test

        // Generate a valid JWT token for testing
        token = jwt.sign({ id: 'testUserId' }, process.env.SUPER_SECRET, { expiresIn: '1h' });
    });

    describe('POST /api/notifications', () => {
        it('should create a notification successfully', async () => {
            const mockUser = { _id: 'testUserId' };
            const mockNotification = { _id: 'notificationId', userID: 'testUserId', type: notificationTypeEnum.MATCH, message: 'Test Message', link: '/link', priority: notificationPriorityEnum.MEDIUM };

            UserModel.findById.mockResolvedValue(mockUser);
            NotificationModel.create.mockResolvedValue(mockNotification);

            const response = await request(app)
                .post('/api/notifications')
                .set('x-access-token', `${token}`)
                .send({
                    userID: 'testUserId',
                    type: notificationTypeEnum.MATCH,
                    message: 'Test Message',
                    link: '/link',
                    priority: notificationPriorityEnum.MEDIUM
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Notification created successfully', notification: mockNotification });
        });

        it('should return 404 if user is not found', async () => {
            UserModel.findById.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/notifications')
                .set('x-access-token', `${token}`)
                .send({
                    userID: 'testUserId',
                    type: notificationTypeEnum.MATCH,
                    message: 'Test Message',
                    link: '/link',
                    priority: notificationPriorityEnum.MEDIUM
                });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'User not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            UserModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/notifications')
                .set('x-access-token', `${token}`)
                .send({
                    userID: 'testUserId',
                    type: notificationTypeEnum.MATCH,
                    message: 'Test Message',
                    link: '/link',
                    priority: notificationPriorityEnum.MEDIUM
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('PUT /api/notifications/:notificationId/status', () => {
        it('should update notification status successfully', async () => {
            const mockNotification = { _id: 'notificationId', status: notificationStatusEnum.NOT_SEEN };

            NotificationModel.findById.mockResolvedValue(mockNotification);

            const response = await request(app)
                .put('/api/notifications/notificationId/status')
                .set('x-access-token', `${token}`)
                .send({ status: notificationStatusEnum.SEEN });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Notification status updated', notification: mockNotification });
        });

        it('should return 404 if notification is not found', async () => {
            NotificationModel.findById.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/notifications/notificationId/status')
                .set('x-access-token', `${token}`)
                .send({ status: notificationStatusEnum.SEEN });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Notification not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            NotificationModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/notifications/notificationId/status')
                .set('x-access-token', `${token}`)
                .send({ status: notificationStatusEnum.SEEN });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('DELETE /api/notifications/:notificationId', () => {
        it('should delete a notification successfully', async () => {
            NotificationModel.findByIdAndDelete.mockResolvedValue({ _id: 'notificationId' });

            const response = await request(app)
                .delete('/api/notifications/notificationId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Notification deleted successfully' });
        });

        it('should return 404 if notification is not found', async () => {
            NotificationModel.findByIdAndDelete.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/notifications/notificationId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Notification not found' });
        });

        it('should handle errors and return 500 status code', async () => {
            NotificationModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .delete('/api/notifications/notificationId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/notifications/user/:userID', () => {
        it('should retrieve notifications by user ID', async () => {
            const mockNotifications = [
                { _id: 'notification1', userID: 'testUserId', type: notificationTypeEnum.MATCH, message: 'Test Message 1', link: '/link1', priority: notificationPriorityEnum.MEDIUM },
                { _id: 'notification2', userID: 'testUserId', type: notificationTypeEnum.MESSAGE, message: 'Test Message 2', link: '/link2', priority: notificationPriorityEnum.HIGH }
            ];

            NotificationModel.find.mockResolvedValue(mockNotifications);

            const response = await request(app)
                .get('/api/notifications/user/testUserId')
                .set('x-access-token', `${token}`)
                .query({ type: notificationTypeEnum.MATCH, status: notificationStatusEnum.NOT_SEEN, priority: notificationPriorityEnum.MEDIUM });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ notifications: mockNotifications });
        });

        it('should handle errors and return 500 status code', async () => {
            NotificationModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/notifications/user/testUserId')
                .set('x-access-token', `${token}`)
                .query({ type: notificationTypeEnum.MATCH, status: notificationStatusEnum.NOT_SEEN, priority: notificationPriorityEnum.MEDIUM });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('DELETE /api/notifications/user/:userId', () => {
        it('should delete all notifications by user ID', async () => {
            NotificationModel.deleteMany.mockResolvedValue({ deletedCount: 2 });

            const response = await request(app)
                .delete('/api/notifications/user/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'All notifications deleted successfully' });
        });

        it('should handle errors and return 500 status code', async () => {
            NotificationModel.deleteMany.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .delete('/api/notifications/user/testUserId')
                .set('x-access-token', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });
});
