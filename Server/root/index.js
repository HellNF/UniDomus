// index.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors =require('cors')
const PORT = process.env.PORT || 5050; // Set the port to either the environment port or 5050
const tokenChecker= require('./src/middleware/tokenChecker')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const logRequestSize = (req, res, next) => {
  let requestData = '';
  req.on('data', (chunk) => {
    requestData += chunk;
  });

  req.on('end', () => {
    console.log('Request Size:', Buffer.byteLength(requestData), 'bytes');
    next();
  });

  req.on('error', (err) => {
    console.error('Error reading request data:', err);
    next(err);
  });
};

// Middleware
//pls non mettere niente sopra questi app.use
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed


app.use(express.json());

app.use(cors({
  origin: "*", // Allow access from any address -- no restrictions
}));


app.use('/api/listings/add', tokenChecker);

// Import MongoDB connection function and Mongoose instance
const { connectToMongoDB, mongoose } = require('./src/database/connection');
// Increase maximum request size
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed


// Import routes
const userRoutes = require('./src/routes/userRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');
const listingRoutes=require('./src/routes/listingRoutes');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Listing API',
      version: '1.0.0',
      description: 'API documentation for managing property listings',
    },
  },
  apis: ['./src/routes/*.js'], // Path to the files containing Swagger annotations
};

const specs = swaggerJsdoc(options);


// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    // Use routes
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.use('/api/users', userRoutes);
    app.use('/api/tokens', tokenRoutes);
    app.use('/api/listing', listingRoutes);

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    //close MongoDB connection on process exit
    process.on('SIGINT', async () => {
      try {
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
      } finally {
        server.close(() => {
          console.log('Server stopped');
          process.exit(0);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  });
