// src/socket.js
const socketIo = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIo(server);

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
