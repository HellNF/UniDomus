// index.js
const app= require('./app')


const PORT = process.env.PORT || 5050; // Set the port to either the environment port or 5050


// Import MongoDB connection function and Mongoose instance
const { connectToMongoDB, mongoose } = require('./src/database/connection');

// Connect to MongoDB
connectToMongoDB()
  .then(async () => {
    // Use routes
    // Start the server
    const server = await app.listen(PORT, () => {
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

 