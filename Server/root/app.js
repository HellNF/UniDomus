//app.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const cors =require('cors')
const bodyParser = require('body-parser');
const tokenChecker= require('./src/middleware/tokenChecker')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



// Middleware


app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed


app.use(express.json());
app.use('/api/listings/add', tokenChecker);
// Import MongoDB connection function and Mongoose instance

app.use(cors({
  origin: "*", //allow access form any address --no restrictions
}))
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
  apis: ['./swagger.yaml'], // Add the YAML file path
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/listing', listingRoutes);




module.exports=app;