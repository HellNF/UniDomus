// database/connection.js

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://panciut:fakerationssteamy@cluster0.o0jwf6w.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'UniDomus';

// MongoClient instance
let client;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        client = await MongoClient.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Get MongoDB client
function getMongoClient() {
    if (!client) {
        throw new Error('MongoDB client is not connected');
    }
    return client;
}

// Get database instance
function getDatabase() {
    return client.db(dbName);
}

// Close MongoDB connection
async function closeMongoDBConnection() {
    try {
        await client.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
}

// Export MongoDB connection functions
module.exports = {
    connectToMongoDB,
    getMongoClient,
    getDatabase,
    closeMongoDBConnection,
    dbName
};
