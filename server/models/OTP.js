const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	console.log("=== SEND VERIFICATION EMAIL ===");
	console.log("Email:", email);
	console.log("OTP:", otp);
	console.log("OTP Template function:", typeof otpTemplate);
	
	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			otpTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		// Don't throw the error - let the calling function handle it
	}
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		try {
			await sendVerificationEmail(this.email, this.otp);
		} catch (error) {
			console.log("Error sending verification email:", error);
			// Don't throw the error - let the OTP creation succeed even if email fails
			// The error will be logged but won't cause the request to fail
		}
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;