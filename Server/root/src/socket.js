// src/socket.js
const socketIo = require('socket.io');
require('dotenv').config({ path: '../.env' });

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: `${process.env.FRONTEND_BASE}`, // Update the origin to your frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (message) => {
      // Save the message to the database
      const { matchID, text, userID } = message;
      const newMessage = { matchID, text, userID, date: new Date() };

      // Emit the message to all clients
      io.emit('message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};

module.exports = initializeSocket;
