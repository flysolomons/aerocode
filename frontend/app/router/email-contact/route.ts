// Email API Route
import nodemailer from "nodemailer";
import { NextRequest } from 'next/server';
import { contactCustomerTemplate } from "@/app/templates/contact-customer";
import {contactOfficeTemplate} from "@/app/templates/contact-office";
import emailTransporter from "@/lib/emailTransporter";

export async function POST(request:NextRequest){
    try{

      const { formData } = await request.json();
  
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
        emailTransporter.sendMail(customerMailOptions),
        emailTransporter.sendMail(officeMailOptions),
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