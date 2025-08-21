// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { belamaCustomerTemplate } from "../../templates/belama-customer";
import { belamaOfficeTemplate } from "../../templates/belama-staff";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    price,
    key,
    title,
    membershipType,
    seatSelection,
    paymentMethod,
    firstname,
    surname,
    address,
    telephone,
    mobile,
    email,
    membershipnumber,
    ...otherData
  } = body;

  //Ethereal Mail
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.M365_EMAIL_USER, 
      pass: process.env.M365_EMAIL_PASS, 
    },
  });

  const customerEmailContent = belamaCustomerTemplate({
    firstname,
    title,
    membershipType,
    price,
    seatSelection,
    paymentMethod,
  });

  const officeEmailContent = belamaOfficeTemplate({
    title,
    membershipType,
    price,
    key,
    seatSelection,
    paymentMethod,
    firstname,
    surname,
    address,
    telephone,
    mobile,
    email,
    membershipnumber,
    otherData,
  });

  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thank You for Your ${title || "Belama"} Membership Signup`,
    text: customerEmailContent.text,
    html: customerEmailContent.html,
  };

  const officeMailOptions = {
    from: process.env.EMAIL_USER,
    to: "office@belama.com",
    subject: `New Membership Signup: ${title || "Membership Form"}`,
    text: officeEmailContent.text,
    html: officeEmailContent.html,
  };

  try {
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(officeMailOptions),
    ]);
    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json({ message: "Failed to send emails" }, { status: 500 });
  }
}