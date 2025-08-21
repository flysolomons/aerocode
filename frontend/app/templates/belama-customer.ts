// lib/emailTemplates/belamaCustomerTemplate.ts
interface CustomerTemplateProps {
  firstname: string | undefined;
  title: string | undefined;
  membershipType: string | undefined;
  price: string | undefined;
  seatSelection: string | undefined;
  paymentMethod: string | undefined;
}

export function belamaCustomerTemplate({
  firstname,
  title,
  membershipType,
  price,
  seatSelection,
  paymentMethod,
}: CustomerTemplateProps) {
  return {
    text: `
Dear ${firstname || "Customer"},

Thank you for signing up for the ${title || "Belama"} membership! We have received your submission and are processing it. Below are the key details of your membership:

Membership Type: ${membershipType || "Not provided"}
Price: SBD ${price || "Not provided"}
Seat Selection: ${seatSelection || "Not specified"}
Payment Method: ${paymentMethod || "Not specified"}

We will contact you soon with further details. If you have any questions, please reach out to us at support@belama.com.

Best regards,
The Belama Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a73e8;">Thank You for Your Membership Signup!</h2>
        <p>Dear ${firstname || "Customer"},</p>
        <p>Thank you for signing up for the <strong>${title || "Belama"}</strong> membership! We have received your submission and are processing it. Below are the key details of your membership:</p>
        <h3>Membership Details</h3>
        <ul>
          <li><strong>Membership Type:</strong> ${membershipType || "Not provided"}</li>
          <li><strong>Price:</strong> SBD ${price || "Not provided"}</li>
          <li><strong>Seat Selection:</strong> ${seatSelection || "Not specified"}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod || "Not specified"}</li>
        </ul>
        <p>We will contact you soon with further details. If you have any questions, please reach out to us at <a href="mailto:support@belama.com">support@belama.com</a>.</p>
        <p>Best regards,<br>The Belama Team</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #888;">
          <p>Belama Membership Services &copy; ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `,
  };
}