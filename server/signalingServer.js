const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User');

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
const userImageCache = {};

async function getRoomParticipants(roomId) {
  const sockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  // Fetch all userIds in the room
  const userIds = sockets.map(id => {
    const s = io.sockets.sockets.get(id);
    return s ? s.userId : null;
  }).filter(Boolean);
  // Find missing images
  const missingUserIds = userIds.filter(uid => !userImageCache[uid]);
  if (missingUserIds.length > 0) {
    try {
      const users = await User.find({ _id: { $in: missingUserIds } }, { image: 1 }).lean();
      users.forEach(u => {
        userImageCache[u._id.toString()] = u.image;
      });
    } catch (e) {
      // ignore errors, fallback to default avatar in frontend
    }
  }
  return sockets.map(id => {
    const s = io.sockets.sockets.get(id);
    return s ? {
      socketId: s.id,
      userId: s.userId,
      userName: s.userName,
      isInstructor: s.isInstructor,
      image: userImageCache[s.userId] || undefined
    } : null;
  }).filter(Boolean);
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a live class room
  socket.on('join-room', async ({ roomId, userId, userName, isInstructor }) => {
    console.log('[DEBUG][Signaling] User joined:', { userId, userName, isInstructor, socketId: socket.id });
    console.log(`User ${userName || userId} (${userId}) joining room ${roomId}`);
    socket.join(roomId);
    socket.userId = userId; // Store userId for reference
    socket.userName = userName;
    socket.isInstructor = isInstructor;
    // Preload image for this user
    if (!userImageCache[userId]) {
      try {
        const userDoc = await User.findById(userId, { image: 1 });
        if (userDoc && userDoc.image) userImageCache[userId] = userDoc.image;
      } catch (e) {}
    }
    // Send the new user the list of existing participants
    const existingParticipants = (await getRoomParticipants(roomId)).filter(p => p.socketId !== socket.id);
    socket.emit('participants', existingParticipants);
    // Send the latest Excalidraw scene if it exists
    if (roomState[roomId] && roomState[roomId].excalidrawScene) {
      socket.emit('whiteboard-scene-update', { elements: roomState[roomId].excalidrawScene });
    }
    // Notify others about the new user
    socket.to(roomId).emit('user-joined', { userId, userName, socketId: socket.id, isInstructor });
    // Update all with the new participant list
    io.to(roomId).emit('participants', await getRoomParticipants(roomId));
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
  socket.on('raise-hand', async ({ roomId, userId, userName }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    if (!roomState[roomId].raisedHands) roomState[roomId].raisedHands = [];
    if (!roomState[roomId].raisedHands.some(h => h.userId === userId)) {
      roomState[roomId].raisedHands.push({ userId, userName });
      // Mark handRaised on participant
      io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands.map(h => h.userId));
      io.to(roomId).emit('participants', await getRoomParticipants(roomId));
    }
  });
  socket.on('lower-hand', async ({ roomId, userId }) => {
    if (!roomState[roomId] || !roomState[roomId].raisedHands) return;
    roomState[roomId].raisedHands = roomState[roomId].raisedHands.filter(h => h.userId !== userId);
    io.to(roomId).emit('hands-updated', roomState[roomId].raisedHands.map(h => h.userId));
    io.to(roomId).emit('participants', await getRoomParticipants(roomId));
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
  // Broadcast whiteboard-opened event
  socket.on('whiteboard-opened', ({ roomId }) => {
    io.to(roomId).emit('whiteboard-opened');
  });

  // --- Excalidraw Whiteboard Scene Broadcast ---
  socket.on('whiteboard-scene-update', ({ roomId, elements }) => {
    console.log('[DEBUG][Signaling] Relaying whiteboard-scene-update', { roomId, elementsCount: elements.length });
    // Persist the latest scene for the room
    if (!roomState[roomId]) roomState[roomId] = {};
    roomState[roomId].excalidrawScene = elements;
    socket.to(roomId).emit('whiteboard-scene-update', { elements });
  });

  // --- Mute/Unmute ---
  socket.on('mute-all', async ({ roomId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    roomState[roomId].mutedUsers = clients.map(id => io.sockets.sockets.get(id)?.userId).filter(Boolean);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
    io.to(roomId).emit('participants', await getRoomParticipants(roomId));
  });
  socket.on('unmute-all', async ({ roomId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    roomState[roomId].mutedUsers = [];
    io.to(roomId).emit('muted-users', []);
    io.to(roomId).emit('participants', await getRoomParticipants(roomId));
  });
  socket.on('mute-user', async ({ roomId, userId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    if (!roomState[roomId].mutedUsers) roomState[roomId].mutedUsers = [];
    if (!roomState[roomId].mutedUsers.includes(userId)) roomState[roomId].mutedUsers.push(userId);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
    io.to(roomId).emit('participants', await getRoomParticipants(roomId));
  });
  socket.on('unmute-user', async ({ roomId, userId }) => {
    if (!roomState[roomId]) roomState[roomId] = {};
    if (!roomState[roomId].mutedUsers) roomState[roomId].mutedUsers = [];
    roomState[roomId].mutedUsers = roomState[roomId].mutedUsers.filter(id => id !== userId);
    io.to(roomId).emit('muted-users', roomState[roomId].mutedUsers);
    io.to(roomId).emit('participants', await getRoomParticipants(roomId));
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
        // Update all with the new participant list
        setTimeout(async () => {
          io.to(roomId).emit('participants', await getRoomParticipants(roomId));
        }, 100);
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