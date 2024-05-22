// app.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Update the origin to your frontend URL

// Import routes from the index
const routes = require('./src/routes');

// Swagger setup
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
app.use('/api', routes);

module.exports = app;
