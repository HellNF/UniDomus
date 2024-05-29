const request = require('supertest');
const app = require('../../app.js');
const Report = require('../models/reportModel.js');
const User = require('../models/userModel.js');
const Match = require('../models/matchModel.js');
const Listing = require('../models/listingModel.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { reportTypeEnum } = require('../models/enums.js');
const { describe } = require('node:test');

require('dotenv').config({ path: '../../.env' });

jest.mock('../models/userModel');
jest.mock('../models/reportModel');
jest.mock('../models/matchModel');
jest.mock('../models/listingModel');
const validateTarget = jest.fn();

describe('Report Controller', () => {
    let token;
    let userId;

    beforeAll(async () => {
        userId = new mongoose.Types.ObjectId().toString();
        token = jwt.sign({ id: userId, isAdmin: true }, process.env.SUPER_SECRET, { expiresIn: '1h' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/reports', () => {
        it('should return all reports', async () => {
            const reports = [
                { _id: '1', reportType: 'user', description: 'Test report 1' },
                { _id: '2', reportType: 'listing', description: 'Test report 2' },
            ];
            Report.find.mockResolvedValue(reports);

            const response = await request(app)
                .get('/api/reports')
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body.reports).toEqual(reports);
        });

        it('should handle errors', async () => {
            Report.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/reports')
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('POST /api/reports', () => {
        it('should create a new report', async () => {
            const newReport = { reportType: reportTypeEnum.USER, targetID: '1', description: 'Test report' };
            const savedReport = { ...newReport, _id: '1', createdAt: new Date() };
            Report.create.mockResolvedValue(savedReport);
            User.findById.mockResolvedValue({ _id: '1' });
            validateTarget.mockResolvedValue(Promise.resolve(true));


            const response = await request(app)
                .post('/api/reports')
                .set('x-access-token', token)
                .send(newReport);

            expect(response.status).toBe(201);
            expect(response.body.report).toEqual(savedReport);
        });

        it('should handle errors', async () => {
            User.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/reports')
                .set('x-access-token', token)
                .send({ reportType: 'user', targetID: '1', description: 'Test report' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('GET /api/reports/:id', () => {
        it('should return a report by id', async () => {
            const report = { _id: '1', reportType: 'user', description: 'Test report' };
            Report.findById.mockResolvedValue(report);

            const response = await request(app)
                .get('/api/reports/1')
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body.report).toEqual(report);
        });

        it('should handle report not found', async () => {
            Report.findById.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/reports/1')
                .set('x-access-token', token);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Report not found');
        });

        it('should handle errors', async () => {
            Report.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/reports/1')
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('GET /api/reports/reviewing/:userId', () => {
        it('should return reports in reviewing status for a user', async () => {
            const reports = [
                { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione', reviewerID: userId },
            ];
            Report.find.mockResolvedValue(reports);

            const response = await request(app)
                .get(`/api/reports/reviewing/${userId}`)
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body.reports).toEqual(reports);
        });

        it('should handle errors', async () => {
            Report.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/reports/reviewing/${userId}`)
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('PUT /api/reports/review', () => {
        it('should update the status of a report to reviewing', async () => {
            const report = { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione' };
            Report.findByIdAndUpdate.mockResolvedValue(report);

            const response = await request(app)
                .put('/api/reports/review')
                .set('x-access-token', token)
                .send({ reportID: '1', reviewerID: userId, reportStatus: 'in revisione' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Report updated successfully');
            expect(response.body.report).toEqual(report);
        });

        it('should handle report not found', async () => {
            Report.findByIdAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/reports/review')
                .set('x-access-token', token)
                .send({ reportID: '1', reviewerID: userId, reportStatus: 'in revisione' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Report not found');
        });

        it('should handle errors', async () => {
            Report.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/reports/review')
                .set('x-access-token', token)
                .send({ reportID: '1', reviewerID: userId, reportStatus: 'in revisione' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('PUT /api/reports/resolve', () => {
        it('should update the status of a report to resolved', async () => {
            const report = { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione' };
            const resolvedReport = { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione' };
            Report.findByIdAndUpdate.mockResolvedValue(resolvedReport);

            const response = await request(app)
                .put('/api/reports/resolve')
                .set('x-access-token', token)
                .send({ _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Report updated successfully');
            expect(response.body.report).toEqual(resolvedReport);
        });

        it('should handle report not found', async () => {
            Report.findByIdAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/reports/resolve')
                .set('x-access-token', token)
                .send({ reportID: '1', reportStatus: 'risolto' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Report not found');
        });

        it('should handle errors', async () => {
            Report.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/reports/resolve')
                .set('x-access-token', token)
                .send({ reportID: '1', reportStatus: 'risolto' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('PUT /api/reports/remove', () => {
        it('should update the status of a report to resolved and remove the reviewer', async () => {
            const report = { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione', reviewerID: userId };
            const resolvedReport = { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'in revisione' };
            Report.findByIdAndUpdate.mockResolvedValue(resolvedReport);

            const response = await request(app)
                .put('/api/reports/remove')
                .set('x-access-token', token)
                .send({ reportID: '1', reportStatus: 'risolto' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Report updated successfully');
            expect(response.body.report).toEqual(resolvedReport);
        });

        it('should handle report not found', async () => {
            Report.findByIdAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/reports/remove')
                .set('x-access-token', token)
                .send({ reportID: '1', reportStatus: 'risolto' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Report not found');
        });

        it('should handle errors', async () => {
            Report.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/reports/remove')
                .set('x-access-token', token)
                .send({ reportID: '1', reportStatus: 'risolto' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });
    describe('GET /api/reports/reporter/:reporterID', () => {
        it('should return reports by reporter', async () => {
            const reports = [
                { _id: '1', reportType: 'user', description: 'Test report', reporterID: userId },
            ];
            Report.find.mockResolvedValue(reports);

            const response = await request(app)
                .get(`/api/reports/reporter/${userId}`)
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body.reports).toEqual(reports);
        });

        it('should handle errors', async () => {
            Report.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/reports/reporter/${userId}`)
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('GET /api/reports/target/:targetID', () => {
        it('should return reports by target', async () => {
            const reports = [
                { _id: '1', reportType: 'user', description: 'Test report', targetID: userId },
            ];
            Report.find.mockResolvedValue(reports);

            const response = await request(app)
                .get(`/api/reports/target/${userId}`)
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body.reports).toEqual(reports);
        });

        it('should handle errors', async () => {
            Report.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/reports/target/${userId}`)
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('GET /api/reports/resolved', () => {
        it('should return all resolved reports', async () => {
            const reports = [
                { _id: '1', reportType: 'user', description: 'Test report', reportStatus: 'risolto' },
            ];
            Report.find.mockResolvedValue(reports);

            const response = await request(app)
                .get('/api/reports/resolved')
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body.reports).toEqual(reports);
        });

        it('should handle errors', async () => {
            Report.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/reports/resolved')
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });
    
});
