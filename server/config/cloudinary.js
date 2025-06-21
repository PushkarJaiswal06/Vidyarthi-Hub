const cloudinary = require("cloudinary").v2; //! Cloudinary is being required

exports.cloudinaryConnect = () => {
	try {
		console.log("=== CLOUDINARY CONNECTION DEBUG ===");
		console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
		console.log("API_KEY:", process.env.API_KEY ? "SET" : "NOT SET");
		console.log("API_SECRET:", process.env.API_SECRET ? "SET" : "NOT SET");
		
		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
		
		console.log("Cloudinary configured successfully");
		console.log("=====================================");
	} catch (error) {
		console.log("Cloudinary configuration error:", error);
	}
};