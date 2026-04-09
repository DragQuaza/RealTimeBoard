const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for MVP
    methods: ['GET', 'POST']
  }
});

// In-memory store for room state
// Map<roomId, Map<socketId, { username }>>
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user joins a room
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    
    // Add user to the room
    const roomUsers = rooms.get(roomId);
    roomUsers.set(socket.id, { username });
    
    // Broadcast updated user list to everyone in the room
    const usersInRoom = Array.from(roomUsers.values());
    io.to(roomId).emit('room-users', usersInRoom);
    
    socket.to(roomId).emit('user-joined', `${username} joined the room`);
    
    console.log(`${username} (${socket.id}) joined room ${roomId}`);
  });

  // Handle drawing events
  socket.on('drawing', (data) => {
    // data should contain { roomId, ...strokeData }
    const { roomId, ...strokeData } = data;
    // Broadcast the drawing data to everyone in the room except the sender
    socket.to(roomId).emit('drawing', strokeData);
  });

  // Handle clear canvas event
  socket.on('clear-canvas', (roomId) => {
    socket.to(roomId).emit('clear-canvas');
  });

  // Handle disconnection
  socket.on('disconnecting', () => {
    // A socket might be in multiple rooms
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id && rooms.has(roomId)) {
        const roomUsers = rooms.get(roomId);
        const username = roomUsers.get(socket.id)?.username || 'Someone';
        
        // Remove user from room
        roomUsers.delete(socket.id);
        
        // Clean up empty rooms
        if (roomUsers.size === 0) {
          rooms.delete(roomId);
        } else {
          // Broadcast updated user list
          io.to(roomId).emit('room-users', Array.from(roomUsers.values()));
          socket.to(roomId).emit('user-left', `${username} left the room`);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
