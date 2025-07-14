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

const rooms = {}; // { roomId: Set<socket.id> }

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;

    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socket.id);

    // Notify the new user of all existing users
    const otherUsers = Array.from(rooms[roomId]).filter(id => id !== socket.id);
    socket.emit('all-users', { users: otherUsers });

    // Notify existing users of the new user
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('send-offer', ({ targetId, offer }) => {
    io.to(targetId).emit('receive-offer', { senderId: socket.id, offer });
  });

  socket.on('send-answer', ({ targetId, answer }) => {
    io.to(targetId).emit('receive-answer', { senderId: socket.id, answer });
  });

  socket.on('send-ice-candidate', ({ targetId, candidate }) => {
    io.to(targetId).emit('receive-ice-candidate', { senderId: socket.id, candidate });
  });

  socket.on('disconnect', () => {
    const { roomId } = socket;
    if (roomId && rooms[roomId]) {
      rooms[roomId].delete(socket.id);
      socket.to(roomId).emit('user-left', { userId: socket.id });
      if (rooms[roomId].size === 0) delete rooms[roomId];
    }
  });

  // --- The rest of your app-specific events (polls, chat, whiteboard, mute, etc.) remain unchanged below ---

  // --- Polls & Quizzes ---
  socket.on('launch-poll', ({ roomId, poll }) => {
    io.to(roomId).emit('poll-launched', poll);
  });
  socket.on('vote-poll', ({ roomId, optionIdx, userId }) => {
    io.to(roomId).emit('poll-updated', { optionIdx, userId });
  });
  socket.on('end-poll', ({ roomId }) => {
    io.to(roomId).emit('poll-ended');
  });

  // --- Hand Raise & Reactions ---
  socket.on('raise-hand', ({ roomId, userId, userName }) => {
    io.to(roomId).emit('hands-updated', { userId, userName, raised: true });
  });
  socket.on('lower-hand', ({ roomId, userId }) => {
    io.to(roomId).emit('hands-updated', { userId, raised: false });
  });
  socket.on('send-reaction', ({ roomId, emoji, userName }) => {
    io.to(roomId).emit('show-reaction', { emoji, userName });
  });

  // --- Whiteboard ---
  socket.on('whiteboard-update', ({ roomId, data }) => {
    socket.broadcast.to(roomId).emit('whiteboard-update', data);
  });
  socket.on('whiteboard-clear', ({ roomId }) => {
    io.to(roomId).emit('whiteboard-clear');
  });

  // --- Mute/Unmute ---
  socket.on('mute-all', ({ roomId }) => {
    io.to(roomId).emit('muted-users', { all: true });
  });
  socket.on('unmute-all', ({ roomId }) => {
    io.to(roomId).emit('muted-users', { all: false });
  });
  socket.on('mute-user', ({ roomId, userId }) => {
    io.to(roomId).emit('muted-users', { userId, muted: true });
  });
  socket.on('unmute-user', ({ roomId, userId }) => {
    io.to(roomId).emit('muted-users', { userId, muted: false });
  });
  socket.on('request-unmute', ({ roomId, userId, userName }) => {
    io.to(roomId).emit('unmute-requested', { userId, userName });
  });

  // Chat messages
  socket.on('chat-message', ({ roomId, ...msg }) => {
    socket.to(roomId).emit('chat-message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
}); 