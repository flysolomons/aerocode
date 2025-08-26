// Email API Route
import { NextRequest } from 'next/server';
import { contactCustomerTemplate } from "@/app/templates/contact-customer";
import {contactOfficeTemplate} from "@/app/templates/contact-office";
import {sendEmail} from "@/lib/mailer";

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
        to: process.env.CONTACT_FORM_RECIPIENT || '',
        subject: 'New Contact Form Submission',
        html: contactOfficeTemplate(formData.name,formData.phone, formData.email, formData.subject,formData.message, formData.referenceId),
      };
      
           
      // Send email to customer and office
     
      await Promise.all([
        sendEmail(customerMailOptions),
        sendEmail(officeMailOptions),
      ]);
  
      return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    }
    catch(error){

        console.log(error);
        return new Response(JSON.stringify({ message: 'Error sending email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}