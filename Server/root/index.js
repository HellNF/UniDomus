// index.js

const express = require('express');
const app = express();
const cors =require('cors')
const PORT = process.env.PORT || 5050; // Set the port to either the environment port or 5050

// Middleware
app.use(express.json());

// Import MongoDB connection function and Mongoose instance
const { connectToMongoDB, mongoose } = require('./src/database/connection');
app.use(cors({
  origin: "*", //allow access form any address --no restrictions
}))
// Import routes
const userRoutes = require('./src/routes/userRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');

// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    // Use routes
    app.use('/api/users', userRoutes);
    app.use('/api/tokens', tokenRoutes);

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
