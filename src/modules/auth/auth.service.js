import { UserModel } from "../../DB/models/user.modle.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js"
import CryptoJS from "crypto-js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { generateEncryption } from "../../utils/security/encryption.security.js";
import jwt from "jsonwebtoken"


export const login=asyncHandler(
    async(req,res,next)=>{
  
      const {email,password}=req.body
    const user=await DBService.findOne({model:UserModel,filter:{email},select:"+password"})
      if(!user){
        return next(new Error("User not found",{cause:404}))
      }
      const match=compareHash({plaintext:password,hash:user.password})
      if(!match){
        return next(new Error("Invalid login Data",{cause:404}))
      }
      const  access_token=jwt.sign({_id:user._id,isLoggedIn:true},"secret key 123",{
       expiresIn:60*30
      })
      const refresh_token=jwt.sign({_id:user._id,isLoggedIn:true},"secret key 123456",{
        expiresIn:'1y'
      })
      return successResponse({res,data:{access_token,refresh_token}})
   
    
}
)

export const signup=asyncHandler(
    async(req,res,next)=>{
      
            const {fullName,email,password,phone}=req.body
          
            if( await DBService.findOne({model:UserModel,filter:{email}})){
              return next(new Error("User already exists",{cause:409}))
            }
            const hashedPassword=await generateHash({plaintext:password})
            const encphone= await generateEncryption({plaintext:phone})
            const user=await DBService.create({model:UserModel,data:{fullName,email,password:hashedPassword,phone:encphone}})
            return successResponse({res,messsage:"User created successfully",status:201,data:user})
          
    }
)

