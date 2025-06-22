exports.contactUsEmail = (
    email,
    firstname,
    lastname,
    message,
    phoneNo,
    countrycode
  ) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://vidyarthi-hub-seven.vercel.app/login"><img class="logo"
                    src="https://i.ibb.co/7Xyj3PC/logo.png" alt="VidyarthiHub Logo"></a>
            <div class="message">Thank You for Contacting Us</div>
            <div class="body">
                <p>Dear ${firstname} ${lastname},</p>
                <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                <p>Your message details:</p>
                <p><strong>Subject:</strong> ${message}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p>We appreciate your patience and look forward to assisting you.</p>
            </div>
            <div class="support">If you have any urgent questions or need immediate assistance, please feel free to reach out to us at <a
                    href="https://www.linkedin.com/in/pushkar-jaiswal06/">https://www.linkedin.com/in/pushkar-jaiswal06/</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`
  }