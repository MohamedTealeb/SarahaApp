

import nodemailer from "nodemailer";

export async function sendEmail({from=process.env.APP_EMAIL,to,subject,text,html,attachments=[]}){
    const transporter = nodemailer.createTransport({
        service:"gmail",
         
         auth: {
           user: process.env.APP_EMAIL,
           pass: process.env.APP_PASSWORD,
         },
       });
       
       // Wrap in an async IIFE so we can use await.
       
         const info = await transporter.sendMail({
           from:`Saraha <${from}>`,
           to,
           subject,
           text,
           html,
           attachments,
         });
         
         console.log("Message sent:", info.messageId);
       
       
    
}