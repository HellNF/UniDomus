// index.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5050; // Set the port to either the environment port or 5050

// Middleware
app.use(express.json());

// Import MongoDB connection functions
const { connectToMongoDB, closeMongoDBConnection } = require('./src/database/connection');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');

// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    console.log('MongoDB connected');
    
    // Use routes
    app.use('/api/users', userRoutes);
    app.use('/api/tokens', tokenRoutes);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Close MongoDB connection on process exit
process.on('SIGINT', async () => {
    await closeMongoDBConnection();
    console.log('MongoDB connection closed');
    process.exit(0);
});
