// index.js
const app = require('./app');
const http = require('http');
const { connectToMongoDB, mongoose } = require('./src/database/connection');
const initializeSocket = require('./src/socket'); // Import the socket initialization function

const PORT = process.env.PORT || 5050; // Set the port to either the environment port or 5050

// Create an HTTP server and integrate with the Express app
const server = http.createServer(app);

// Connect to MongoDB
connectToMongoDB()
  .then(async () => {
    // Initialize Socket.io
    const io = initializeSocket(server);

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Close MongoDB connection on process exit
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
