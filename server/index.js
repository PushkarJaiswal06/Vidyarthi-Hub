const dotenv = require("dotenv");
dotenv.config();
console.log("MONGODB_URL:", process.env.MONGODB_URL);
console.log("Current working directory:", process.cwd());
console.log("=== CLOUDINARY CONFIG ===");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.API_KEY ? "SET" : "NOT SET");
console.log("API_SECRET:", process.env.API_SECRET ? "SET" : "NOT SET");
console.log("FOLDER_NAME:", process.env.FOLDER_NAME);
console.log("=========================");
console.log("=== RAZORPAY CONFIG ===");
console.log("RAZORPAY_KEY:", process.env.RAZORPAY_KEY ? "SET" : "NOT SET");
console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET ? "SET" : "NOT SET");
console.log("=========================");
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const liveClassRoutes = require("./routes/LiveClass");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: [
			"http://localhost:3000", // for local dev
			"https://vidyarthi-hub-v2-frontend.onrender.com", // Render frontend
			"https://vidyarthi-hub-v2-frontend.vercel.app", // Vercel frontend (added)
			"https://vidyarthi-hub.xyz", // custom domain
			"https://www.vidyarthi-hub.xyz" // www custom domain
		],
		credentials: true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/liveclass", liveClassRoutes);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

// Expose Razorpay key to frontend
app.get("/api/v1/razorpay-key", (req, res) => {
	console.log("=== RAZORPAY KEY REQUEST ===");
	console.log("RAZORPAY_KEY:", process.env.RAZORPAY_KEY ? "SET" : "NOT SET");
	
	if (!process.env.RAZORPAY_KEY) {
		console.log("ERROR: RAZORPAY_KEY not configured");
		return res.status(500).json({
			success: false,
			message: "Razorpay key not configured"
		});
	}
	
	return res.json({
		success: true,
		key: process.env.RAZORPAY_KEY
	});
});

const server = app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
});

// Socket.io signaling server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://vidyarthi-hub-seven.vercel.app",
      "https://vidyarthi-hub-v2-frontend.vercel.app", // Vercel frontend (added)
      "https://www.vidyarthi-hub.xyz"
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

  // Chat messages
  socket.on('chat-message', ({ roomId, ...msg }) => {
    socket.to(roomId).emit('chat-message', msg);
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

console.log(`Signaling server integrated on port ${PORT}`);

