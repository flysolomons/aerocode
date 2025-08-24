import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const smtpConfig: SMTPTransport.Options = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure:true,
    auth: {
        user: process.env.M365_EMAIL_USER, 
        pass: process.env.M365_EMAIL_PASS, 
    }
};
const emailTransporter = nodemailer.createTransport(smtpConfig);

export default emailTransporter;