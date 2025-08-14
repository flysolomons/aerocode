export const contactCustomerTemplate = (name: string, email: string, message: string, referenceId: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; border-radius:10px;}
      .header { background-color: #1A194D; color: white; padding: 10px; text-align: center; }
      .content { padding: 20px; border: 1px solid #ccc; }
      .reference { font-weight: bold; color: #0070f3; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://test.solair.com.sb/logo-mobile-white.svg" style="width:50px;height:50px;"/>
        <h1>Thank You for Contacting Us!</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p>
        <p><strong>Your Message:</strong> ${message}</p>
        <p>
            <strong>Contact Reference ID:</strong> <span class="reference">${referenceId}</span><br/>
            <span style="font-size:10px;color:#F15F5F;">*Use this reference to follow up with your enquiry.</span>
        </p>
        <p>Best regards,<br>Fly Solomons</p>
      </div>
    </div>
  </body>
  </html>
`;