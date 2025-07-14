const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.SIGNALING_PORT || 5000;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://vidyarthi-hub-seven.vercel.app",
      "https://www.vidyarthi-hub.xyz",
      "https://vidyarthi-hub-v2-frontend.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

const roomState = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a live class room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    console.log(`User ${userName || userId} (${userId}) joining room ${roomId}`);
    socket.join(roomId);
    socket.userId = userId; // Store userId for reference
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
    console.log(`${userId} joined room ${roomId}`);
  });

  // Relay offer
  socket.on('offer', ({ roomId, offer, userId }) => {
    socket.to(roomId).emit('offer', { offer, userId, socketId: socket.id });
  });

  // Relay answer
  socket.on('answer', ({ roomId, answer, userId }) => {
    socket.to(roomId).emit('answer', { answer, userId, socketId: socket.id });
  });

  // Relay ICE candidates
  socket.on('ice-candidate', ({ roomId, candidate, userId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, userId, socketId: socket.id });
  });

  // --- Polls & Quizzes ---
  socket.on('launch-poll', ({ roomId, poll }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    roomState[roomId].activePoll = { ...poll, voters: [] };
    io.to(roomId).emit('poll-launched', roomState[roomId].activePoll);
  });
  socket.on('vote-poll', ({ roomId, optionIdx, userId }) => {
    const poll = roomState[roomId]?.activePoll;
    if (!poll || poll.voters.includes(userId)) return;
    poll.votes[optionIdx]++;
    poll.voters.push(userId);
    io.to(roomId).emit('poll-updated', poll);
  });
  socket.on('end-poll', ({ roomId }) => {
    const poll = roomState[roomId]?.activePoll;
    if (poll) {
      io.to(roomId).emit('poll-ended', poll);
      roomState[roomId].activePoll = null;
    }
  });

  // --- Hand Raise & Reactions ---
  socket.on('raise-hand', ({ roomId, userId, userName }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    if (!roomState[roomId].raisedHands) roomState[roomId].raisedHands = [];
    if (!roomState[roomId].raisedHands.some(h => h.userId === userId)) {
      roomState[roomId].raisedHands.push({ userId, userName });
      io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands);
    }
  });
  socket.on('lower-hand', ({ roomId, userId }) => {
    if (!roomState[roomId] || !roomState[roomId].raisedHands) return;
    roomState[roomId].raisedHands = roomState[roomId].raisedHands.filter(h => h.userId !== userId);
    io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands);
  });
  socket.on('send-reaction', ({ roomId, emoji, userName }) => {
    io.to(roomId).emit('show-reaction', { emoji, userName });
  });

  // --- Whiteboard ---
  socket.on('whiteboard-update', ({ roomId, data }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    roomState[roomId].whiteboardData = data;
    socket.broadcast.to(roomId).emit('whiteboard-update', data);
  });
  socket.on('whiteboard-clear', ({ roomId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    roomState[roomId].whiteboardData = [];
    io.to(roomId).emit('whiteboard-clear');
  });

  // --- Mute/Unmute ---
  socket.on('mute-all', ({ roomId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    // For MVP, assume we have a list of userIds in room
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    roomState[roomId].mutedUsers = clients.map(id => io.sockets.sockets.get(id)?.userId).filter(Boolean);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
  });
  socket.on('unmute-all', ({ roomId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    roomState[roomId].mutedUsers = [];
    io.to(roomId).emit('muted-users', []);
  });
  socket.on('mute-user', ({ roomId, userId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    if (!roomState[roomId].mutedUsers) roomState[roomId].mutedUsers = [];
    if (!roomState[roomId].mutedUsers.includes(userId)) roomState[roomId].mutedUsers.push(userId);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
  });
  socket.on('unmute-user', ({ roomId, userId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    if (!roomState[roomId].mutedUsers) roomState[roomId].mutedUsers = [];
    roomState[roomId].mutedUsers = roomState[roomId].mutedUsers.filter(id => id !== userId);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
  });
  socket.on('request-unmute', ({ roomId, userId, userName }) => {
    // Notify instructor(s) in room
    io.to(roomId).emit('unmute-requested', { userId, userName });
  });

  // Chat messages
  socket.on('chat-message', ({ roomId, ...msg }) => {
    socket.to(roomId).emit('chat-message', msg);
  });

  // Handle disconnect
  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('user-left', { socketId: socket.id });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
}); 