import{EventEmitter} from "node:events"
import { sendEmail } from "../email/send.email.js"
import { verifyEmailTemplate } from "../email/templete/verify.emai.template.js"
export const emailEvent=new EventEmitter()
emailEvent.on("confirmEmail",async(data)=>{
    await sendEmail({
        to: data.to, // <-- ERROR HERE
        subject: data.subject || "Verify your email",
        text: data.text || "Please verify your email",
        html: verifyEmailTemplate({ otp: data.otp })
      }).catch(error => {
        console.error("Error sending email:", error);
      });
    })

  