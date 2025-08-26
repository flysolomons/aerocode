// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { belamaCustomerTemplate } from "../../templates/belama-customer";
import { belamaOfficeTemplate } from "../../templates/belama-staff";
import {sendEmail} from "@/lib/mailer";

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
    from: process.env.M365_EMAIL_USER,
    to: email,
    subject: `Thank You for Your ${title || "Belama"} Membership Signup`,
    text: customerEmailContent.text,
    html: customerEmailContent.html,
  };

  const officeMailOptions = {
    from: process.env.M365_EMAIL_USER,
    to: process.env.BELAMA_SIGNUP_RECIPIENT || '',
    subject: `New Membership Signup: ${title || "Membership Form"}`,
    text: officeEmailContent.text,
    html: officeEmailContent.html,
  };

  try {
    await Promise.all([
      sendEmail(customerMailOptions),
      sendEmail(officeMailOptions),
    ]);
    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { message: "Failed to send emails" },
      { status: 500 }
    );
  }
}
