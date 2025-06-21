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

const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
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

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

