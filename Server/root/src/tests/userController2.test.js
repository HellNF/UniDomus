const request = require('supertest');
const app = require('../../app'); // Assicurati che il percorso sia corretto per il tuo setup
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('UserController Operations', () => {

  beforeAll(async () => {
    jest.setTimeout(8000);
    dbConnection = await mongoose.connect(process.env.DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected!');
    
    // Create a valid token
    token = jwt.sign(
      { email: 'test@example.com' },
      process.env.SUPER_SECRET,
      { expiresIn: 86400 } // expires in 24 hours
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
  });

  describe('POST /api/users/registration', () => {
    it('should return error for invalid email', () => {
      return request(app)
        .post('/api/users/registration')
        .send({
          email: 'invalidEmail',
          password: 'Password123!',
          username: 'testuser'
        })
        .expect(400, { message: 'error', errors: [{ field: 'email', message: 'Invalid email' },
        { field: 'username', message: 'Username already taken' }] });
    });

    it('should successfully register a user', () => {
      return request(app)
        .post('/api/users/registration')
        .send({
          email: 'test@example3.com',
          password: 'Password123!',
          username: 'testuser3'
        })
        .expect(200, { message: 'success' });
    });

    it('should return error for duplicate email', () => {
      return request(app)
        .post('/api/users/registration')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          username: 'newuser'
        })
        .expect(400, { message: 'error', errors: [{ field: 'email', message: 'Email already registered' }] });
    });
  });

  describe('POST /api/users/authentication', () => {
    it('should authenticate user and return token', () => {
      return request(app)
        .post('/api/users/authentication')
        .send({
          email: 'test@example3.com',
          password: 'Password123!'
        })
        .expect(200)
        .then(response => {
          expect(response.body.token).toBeDefined();
        });
    });

    it('should return error for wrong password', () => {
      return request(app)
        .post('/api/users/authentication')
        .send({
          email: 'test@example.com',
          password: 'wrongPassword!'
        })
        .expect(401, { success: false, message: 'Wrong password' });
    });
  });

  describe('GET /api/users/tags', () => {
    it('should return tags correctly', () => {
      return request(app)
        .get('/api/users/tags')
        .expect(200)
        .then(response => {
          expect(response.body.hobbies).toBeDefined();
          expect(response.body.habits).toBeDefined();
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user details correctly', () => {
      return request(app)
        .get('/api/users/663e5d76926d71e73809119b')  
        .expect(200)
        .then(response => {
          expect(response.body.user).toBeDefined();
        });
    });

    it('should return error if user not found', () => {
      return request(app)
        .get('/api/users/663e5d76962d71e73809119b')
        .expect(400,{ message: 'User not found' });
    });
  });
});
