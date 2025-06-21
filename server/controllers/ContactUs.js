const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    // Send confirmation email to the user
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res ", emailRes)

    // Send notification email to admin with form data
    const adminEmail = "pushkarjaiswal0604@gmail.com" // Replace with your email
    const adminSubject = "New Contact Form Submission - VidyarthiHub"
    const adminMessage = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstname} ${lastname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
    `

    const adminEmailRes = await mailSender(
      adminEmail,
      adminSubject,
      adminMessage
    )
    console.log("Admin notification sent:", adminEmailRes)

    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}