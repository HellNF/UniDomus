const mongoose = require('mongoose');

const uri = 'mongodb+srv://panciut:fakerationssteamy@cluster0.o0jwf6w.mongodb.net/?retryWrites=true&w=majority';

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = {
  connectToMongoDB,
  mongoose, // Export the Mongoose instance for flexibility
};
