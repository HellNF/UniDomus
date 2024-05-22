// src/socket.js
const socketIo = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Update the origin to your frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (message) => {
      io.emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};

module.exports = initializeSocket;
