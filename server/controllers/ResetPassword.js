const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		// Modern HTML email template
		const html = `
		<!DOCTYPE html>
		<html>
		  <body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 40px;">
			<div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px;">
			  <h2 style="color: #0ea5e9;">Password Reset Request</h2>
			  <p>Hello,</p>
			  <p>We received a request to reset your password for your VidyarthiHub account.</p>
			  <p>
				<a href="${url}"
				   style="display: inline-block; background: #0ea5e9; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
				  Reset Password
				</a>
			  </p>
			  <p>If the button above does not work, copy and paste this link into your browser:</p>
			  <p style="word-break: break-all; color: #555;">
				${url}
			  </p>
			  <p>If you did not request a password reset, you can safely ignore this email.</p>
			  <hr style="margin: 24px 0;">
			  <p style="font-size: 12px; color: #888;">&copy; 2024 VidyarthiHub. All rights reserved.</p>
			</div>
		  </body>
		</html>
		`;
		await mailSender(
			email,
			"Password Reset",
			html
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};