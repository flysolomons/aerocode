import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";

interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  html: string;
  text?:string;
}

export async function sendEmail(mailOptions: MailOptions) {
  try {
    const credential = new ClientSecretCredential(
      process.env.AZURE_AUTH_TENANT_ID || '',
      process.env.AZURE_AUTH_CLIENT_ID || '',
      process.env.AZURE_AUTH_CLIENT_SECRET || ''
    );

    const token = await credential.getToken("https://graph.microsoft.com/.default");
    if (!token?.token) {
      throw new Error("Failed to obtain access token");
    }


    const client = Client.init({
      authProvider: (done) => {
        done(null, token.token);
      },
    });

    const message = {
      message: {
        subject: mailOptions.subject,
        body: {
          contentType: "html",
          content: mailOptions.html,
        },
        toRecipients: [{ emailAddress: { address: mailOptions.to } }],
        from: { emailAddress: { address: mailOptions.from } }
      },
      saveToSentItems: true,
    };

    await client.api(`/users/${process.env.M365_EMAIL_USER}/sendMail`).post(message);

    return { success: true, message: "Email sent successfully" };
  
  } catch (error) {

    console.error("Error sending email:", error);
    throw error;
  
  }
}