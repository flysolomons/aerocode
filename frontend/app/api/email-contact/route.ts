// Email API Route
import nodemailer from "nodemailer";
import { NextRequest } from 'next/server';
import { contactCustomerTemplate } from "@/app/templates/contact-customer";
import {contactOfficeTemplate} from "@/app/templates/contact-office";

export async function POST(request:NextRequest){
    try{
    //const email ="gsaemane@flysolomons.com";

      const { formData } = await request.json();
    
    // Configure Nodemailer transport for Microsoft 365
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.office365.com',
    //     port: 587,
    //     secure: false, // Use STARTTLS
    //     auth: {
    //       user: process.env.M365_EMAIL_USER, // Your M365 email address
    //       pass: process.env.M365_EMAIL_PASS, // Your M365 password or app-specific password
    //     },
    //     tls: {
    //       ciphers: 'SSLv3', // Required for some M365 configurations
    //     },
    // });
      
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
  
      // Customer email
      const customerMailOptions = {
        from: process.env.M365_EMAIL_USER,
        to: formData.email,
        subject: 'Thank You for Your Message',
        html: contactCustomerTemplate(formData.name, formData.email, formData.message, formData.referenceId),
      };

      // Office email
      const officeMailOptions = {
        from: process.env.M365_EMAIL_USER,
        to: process.env.OFFICE_EMAIL || 'skoito@flysolomons.com', // Define OFFICE_EMAIL in .env.local
        subject: 'New Contact Form Submission',
        html: contactOfficeTemplate(formData.name,formData.phone, formData.email, formData.subject,formData.message, formData.referenceId),
      };
      
      // Send email to customer and office
      await Promise.all([
        transporter.sendMail(customerMailOptions),
        transporter.sendMail(officeMailOptions),
      ]);
  
      return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    }catch(error){
        console.log(error);
        return new Response(JSON.stringify({ message: 'Error sending email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}