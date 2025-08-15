// Email API Route
import nodemailer from "nodemailer";
import { NextRequest } from 'next/server';

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
  
      // Email options
      const mailOptions = {
        from: process.env.M365_EMAIL_USER,
        to: formData.email, // Send to the user's email or a fixed admin email
        subject: formData.subject,
        text: formData.message
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
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