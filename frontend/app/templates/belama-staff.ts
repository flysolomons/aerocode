export const belamaStaffTemplate = (name: string, email: string, referenceId: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #9c27b0; color: white; padding: 10px; text-align: center; }
      .content { padding: 20px; border: 1px solid #ccc; }
      .reference { font-weight: bold; color: #9c27b0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Belama Signup</h1>
      </div>
      <div class="content">
        <p><strong>New signup received for Belama.</strong></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reference ID:</strong> <span class="reference">${referenceId}</span></p>
        <p>Please process this signup and follow up as needed.</p>
      </div>
    </div>
  </body>
  </html>
`;