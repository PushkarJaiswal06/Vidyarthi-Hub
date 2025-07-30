const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            console.log("=== EMAIL DEBUG INFO ===");
            console.log("MAIL_HOST:", process.env.MAIL_HOST);
            console.log("MAIL_USER:", process.env.MAIL_USER);
            console.log("MAIL_PASS:", process.env.MAIL_PASS ? "SET" : "NOT SET");
            console.log("Sending email to:", email);
            console.log("Email title:", title);
            console.log("Email body length:", body ? body.length : "UNDEFINED");
            
            // Check if required environment variables are set
            if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
                throw new Error("Missing email configuration. Please check MAIL_HOST, MAIL_USER, and MAIL_PASS environment variables.");
            }
            
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })

            let info = await transporter.sendMail({
                from: 'VidyarthiHub || ',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log("Email sent successfully:", info.messageId);
            return info;
    }
    catch(error) {
        console.log("=== EMAIL ERROR ===");
        console.log("Error sending email:", error.message);
        console.log("Full error:", error);
        throw error; // Re-throw the error so it can be handled by the calling function
    }
}

module.exports = mailSender;