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
const roomState = {}; // { roomId: { screenSharer, raisedHands, mutedUsers, activePoll, whiteboardData } }

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;

    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socket.id);
    if (!roomState[roomId]) roomState[roomId] = {
      screenSharer: null,
      raisedHands: [],
      mutedUsers: [],
      activePoll: null,
      whiteboardData: [],
    };

    // Notify the new user of all existing users
    const otherUsers = Array.from(rooms[roomId]).filter(id => id !== socket.id);
    socket.emit('all-users', { users: otherUsers });

    // Send current room state to the new user
    socket.emit('room-state', roomState[roomId]);

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

  // --- Screen Sharing ---
  socket.on('start-screen-share', ({ roomId, userId }) => {
    if (roomState[roomId]) {
      roomState[roomId].screenSharer = userId;
      io.to(roomId).emit('screen-share-started', { userId });
    }
  });
  socket.on('stop-screen-share', ({ roomId, userId }) => {
    if (roomState[roomId] && roomState[roomId].screenSharer === userId) {
      roomState[roomId].screenSharer = null;
      io.to(roomId).emit('screen-share-stopped', { userId });
    }
  });
  // Instructor can force stop any screen share
  socket.on('force-stop-screen-share', ({ roomId }) => {
    if (roomState[roomId]) {
      const sharer = roomState[roomId].screenSharer;
      roomState[roomId].screenSharer = null;
      io.to(roomId).emit('screen-share-stopped', { userId: sharer });
    }
  });

  // --- Hand Raise ---
  socket.on('raise-hand', ({ roomId, userId, userName }) => {
    if (!roomState[roomId]) return;
    if (!roomState[roomId].raisedHands.some(h => h.userId === userId)) {
      roomState[roomId].raisedHands.push({ userId, userName });
      io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands);
    }
  });
  socket.on('lower-hand', ({ roomId, userId }) => {
    if (!roomState[roomId]) return;
    roomState[roomId].raisedHands = roomState[roomId].raisedHands.filter(h => h.userId !== userId);
    io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands);
  });

  // --- Mute/Unmute ---
  socket.on('mute-all', ({ roomId }) => {
    if (!roomState[roomId]) return;
    const clients = Array.from(rooms[roomId] || []);
    roomState[roomId].mutedUsers = clients.map(id => io.sockets.sockets.get(id)?.userId).filter(Boolean);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
  });
  socket.on('unmute-all', ({ roomId }) => {
    if (!roomState[roomId]) return;
    roomState[roomId].mutedUsers = [];
    io.to(roomId).emit('muted-users', []);
  });
  socket.on('mute-user', ({ roomId, userId }) => {
    if (!roomState[roomId]) return;
    if (!roomState[roomId].mutedUsers.includes(userId)) roomState[roomId].mutedUsers.push(userId);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
  });
  socket.on('unmute-user', ({ roomId, userId }) => {
    if (!roomState[roomId]) return;
    roomState[roomId].mutedUsers = roomState[roomId].mutedUsers.filter(id => id !== userId);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
  });
  socket.on('request-unmute', ({ roomId, userId, userName }) => {
    io.to(roomId).emit('unmute-requested', { userId, userName });
  });

  // --- Polls & Quizzes ---
  socket.on('launch-poll', ({ roomId, poll }) => {
    if (!roomState[roomId]) return;
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

  // --- Reactions ---
  socket.on('send-reaction', ({ roomId, emoji, userName }) => {
    io.to(roomId).emit('show-reaction', { emoji, userName });
  });

  // --- Whiteboard ---
  socket.on('whiteboard-update', ({ roomId, data }) => {
    if (!roomState[roomId]) return;
    roomState[roomId].whiteboardData = data;
    socket.broadcast.to(roomId).emit('whiteboard-update', data);
  });
  socket.on('whiteboard-clear', ({ roomId }) => {
    if (!roomState[roomId]) return;
    roomState[roomId].whiteboardData = [];
    io.to(roomId).emit('whiteboard-clear');
  });

  // --- Chat messages ---
  socket.on('chat-message', ({ roomId, ...msg }) => {
    socket.to(roomId).emit('chat-message', msg);
  });

  // --- Handle disconnect ---
  socket.on('disconnect', () => {
    const { roomId } = socket;
    if (roomId && rooms[roomId]) {
      rooms[roomId].delete(socket.id);
      socket.to(roomId).emit('user-left', { userId: socket.id });
      // Remove from raisedHands and mutedUsers
      if (roomState[roomId]) {
        roomState[roomId].raisedHands = roomState[roomId].raisedHands.filter(h => h.userId !== socket.userId);
        roomState[roomId].mutedUsers = roomState[roomId].mutedUsers.filter(id => id !== socket.userId);
        if (roomState[roomId].screenSharer === socket.userId) {
          roomState[roomId].screenSharer = null;
          io.to(roomId).emit('screen-share-stopped', { userId: socket.userId });
        }
        io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands);
        io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
      }
      if (rooms[roomId].size === 0) {
        delete rooms[roomId];
        delete roomState[roomId];
      }
    }
  });
});

// --- TURN Server Recommendation ---
// For production, deploy your own TURN server (e.g., coturn) and add its credentials to ICE_SERVERS in your frontend.
// Example coturn config: https://github.com/coturn/coturn
// Paid TURN services: Twilio, Xirsys, etc.

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
}); 