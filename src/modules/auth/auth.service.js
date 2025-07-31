import { UserModel } from "../../DB/models/user.modle.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js"
import CryptoJS from "crypto-js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { generateEncryption } from "../../utils/security/encryption.security.js";
import { generateLogin, generateToken, getSignatures, signatureLevelEnum } from "../../utils/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../utils/email/send.email.js";
import { emailEvent } from "../../utils/events/email.event.js";
import { customAlphabet, nanoid } from "nanoid";
import Joi from "joi"
import * as validators from "./auth.validation.js";

export const login=asyncHandler(
    async(req,res,next)=>{
      const validationResult=validators.login.validate({email,password})
      if(validationResult.error){
        return next(new Error(validationResult.error,{cause:400}))
      }

      const {email,password}=req.body
    const user=await DBService.findOne({model:UserModel,filter:{email,provider:"local"},select:"+password"})
      if(!user){
        return next(new Error("User not found",{cause:404}))
      }
      if(!user.confirmEmail){
        return next(new Error("pls confirmed your email",{cause:409}))
      }
      const match=compareHash({plaintext:password,hash:user.password})
      if(!match){
        return next(new Error("Invalid login Data",{cause:404}))
      }
      const credentials=await generateLogin({user})
     
      return successResponse({res,data:{credentials}})
   
    
}
)

export const signup=asyncHandler(
    async(req,res,next)=>{
      
          
            const validationResult=validators.signup.validate({fullName,email,password})
           if(validationResult.error){
            return next(new Error(validationResult.error,{cause:400}))
           }
           const {fullName,email,password,phone}=req.body
          
            if( await DBService.findOne({model:UserModel,filter:{email}})){
              return next(new Error("User already exists",{cause:409}))
            }
            const hashedPassword=await generateHash({plaintext:password})
           const encphone= await generateEncryption({plaintext:phone})
           const otp=customAlphabet("0123456789",6)()
           const confirmEmailOtp=await generateHash({plaintext:otp})
           const user=await DBService.create({model:UserModel,data:{fullName,email,password:hashedPassword,phone:encphone,confirmEmailOtp}})
       
  emailEvent.emit("confirmEmail",{to:email,otp:otp})
            return successResponse({res,messsage:"User created successfully",status:201,data:user})
          
    }
)

async function verifyGoogleAccount(idToken) {
  const client=new OAuth2Client()
  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken,
          audience: "1002559808372-q5mf6iov72p0t4suc1bsbj32da8mqo64.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];
      console.log(payload);
      return payload
  }
}
export const signupGmail=asyncHandler(
    async(req,res,next)=>{
      
        const {idToken}=req.body
        const {picture,email,name,email_Verified}=await verifyGoogleAccount(idToken)
        if(!email_Verified){
          return next(new Error("Email not verified",{cause:400}))
        }
        const user=await DBService.findOne({model:UserModel,filter:{email}})
        if(user){
          if(user.provider==="google"){
           const credentials=await generateLogin({user})
           return successResponse({res,data:{credentials}})
          }
          return next(new Error("User already exists",{cause:409}))
        }
        const newUser=await DBService.create({model:UserModel,data:{fullName:name,email,picture,confirmEmail:Date.now(),provider:"google"}})
      
     
            return successResponse({res,messsage:"User created successfully",status:201,data:{newUser}})
          
    }
)

export const loginGmail=asyncHandler(
    async(req,res,next)=>{
      
        const {idToken}=req.body
        const {email,emailVerified}=await verifyGoogleAccount(idToken)
        if(!emailVerified){
          return next(new Error("Email not verified",{cause:400}))
        }
        const user=await DBService.findOne({model:UserModel,filter:{email,provider:"google"}})
        if(!user){
          return next(new Error("User not found",{cause:404}))
        }
        const credentials=await generateLogin({user})
      
     
            return successResponse({res,data:{credentials}})
          
    }
)

export const  confirmEmail=asyncHandler(
  async(req,res,next)=>{
    
          const {email,otp}=req.body
        const user=await DBService.findOne({model:UserModel,filter:{email,confirmEmail:{$exists:false},
        confirmEmailOtp:{$exists:true}
        }})
        if(!user){
          return next(new Error("nIn-valid acc or already verified",{cause:404}))
        }
        if(!await compareHash({plaintext:otp,hash:user.confirmEmailOtp})){
          return next(new Error("Invalid otp",{cause:400}))
        }
 const updatedUser= await DBService.updateOne({model:UserModel,filter:{email},data:{confirmEmail:Date.now(),$unset:{confirmEmailOtp:true},$inc:{_v:1}}})
       
        
          return updatedUser.matchedCount? successResponse({res,messsage:"User created successfully",status:201,data:{}})
          :next(new Error("faild to confirm email",{cause:404}))
        
  }
)