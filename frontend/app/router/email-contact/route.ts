// Email API Route
import nodemailer from "nodemailer";
import { NextRequest } from "next/server";
import { contactCustomerTemplate } from "@/app/templates/contact-customer";
import { contactOfficeTemplate } from "@/app/templates/contact-office";

export async function POST(request: NextRequest) {
  console.log("=== EMAIL API ROUTE STARTED ===");
  
  try {
    console.log("1. Parsing request JSON...");
    const { formData } = await request.json();
    console.log("2. Form data received:", JSON.stringify(formData, null, 2));

    console.log("3. Checking environment variables...");
    console.log("MAIL_HOST:", process.env.MAIL_HOST);
    console.log("MAIL_PORT:", process.env.MAIL_PORT);
    console.log("M365_EMAIL_USER:", process.env.M365_EMAIL_USER ? "Set" : "Not set");
    console.log("M365_EMAIL_PASS:", process.env.M365_EMAIL_PASS ? "Set" : "Not set");

    if (!process.env.MAIL_HOST || !process.env.M365_EMAIL_USER) {
      throw new Error("Missing required environment variables");
    }

    console.log("4. Creating nodemailer transporter...");
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.M365_EMAIL_USER,
        pass: process.env.M365_EMAIL_PASS,
      },
    });

    console.log("5. Testing template imports...");
    const customerHtml = contactCustomerTemplate(
      formData.name,
      formData.email,
      formData.message,
      formData.referenceId
    );
    console.log("Customer template generated successfully");

    const officeHtml = contactOfficeTemplate(
      formData.name,
      formData.phone,
      formData.email,
      formData.subject,
      formData.message,
      formData.referenceId
    );
    console.log("Office template generated successfully");

    console.log("6. Preparing email options...");
    const customerMailOptions = {
      from: process.env.M365_EMAIL_USER,
      to: formData.email,
      subject: "Thank You for Your Message",
      html: customerHtml,
    };

    const officeMailOptions = {
      from: process.env.M365_EMAIL_USER,
      to: process.env.OFFICE_EMAIL || "skoito@flysolomons.com",
      subject: "New Contact Form Submission",
      html: officeHtml,
    };

    console.log("7. Sending emails...");
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(officeMailOptions),
    ]);

    console.log("8. Emails sent successfully!");
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("=== EMAIL API ERROR ===");
    console.error("Error details:", error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    
    return new Response(
      JSON.stringify({ 
        message: "Error sending email",
        error: error instanceof Error ? error.message : String(error)
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}