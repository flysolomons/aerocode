export const belamaCustomerTemplate = (name: string, email: string, referenceId: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #4caf50; color: white; padding: 10px; text-align: center; }
      .content { padding: 20px; border: 1px solid #ccc; }
      .reference { font-weight: bold; color: #4caf50; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Belama!</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Thank you for signing up with Belama! We're excited to have you on board.</p>
        <p><strong>Your Email:</strong> ${email}</p>
        <p><strong>Reference ID:</strong> <span class="reference">${referenceId}</span></p>
        <p>We'll be in touch with more details soon.</p>
        <p>Best regards,<br>Belama Team</p>
      </div>
    </div>
  </body>
  </html>
`;