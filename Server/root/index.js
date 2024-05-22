// index.js
const app = require('./app');
const http = require('http');
const { connectToMongoDB, mongoose } = require('./src/database/connection');
const initializeSocket = require('./src/socket'); // Import the socket initialization function

const PORT = process.env.PORT || 5050; // Set the port to either the environment port or 5050

// Create an HTTP server and integrate with the Express app
const server = http.createServer(app);

// Variable to hold the Socket.io server instance
let io;

// Connect to MongoDB
connectToMongoDB()
  .then(async () => {
    // Initialize Socket.io
    io = initializeSocket(server);

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  });

// Function to shut down the server gracefully
const shutdown = async () => {
  try {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB connection closed');

    // Close the Socket.io server
    if (io) {
      io.close(() => {
        console.log('Socket.io server closed');
      });
    }

    // Close the HTTP server
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
