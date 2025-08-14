export const contactOfficeTemplate = (name: string, phone: string,email: string, subject:string, message: string, referenceId: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #ff9800; color: white; padding: 10px; text-align: center; }
      .content { padding: 20px; border: 1px solid #ccc; }
      .reference { font-weight: bold; color: #ff9800; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Submission</h1>
      </div>
      <div class="content">
        <p><strong>New contact form submission received.</strong></p>
        <p><strong>Name:</strong> ${name}</p>
         <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Contact Reference ID:</strong> <span class="reference">${referenceId}</span></p>
        <p>Please follow up with the customer as needed.</p>
      </div>
    </div>
  </body>
  </html>
`;