import { asyncHandler, successResponse } from "../../utils/response.js"

import jwt from "jsonwebtoken"
import { decryptEncryption } from "../../utils/security/encryption.security.js"
import { generateLogin, generateToken, getSignatures, signatureLevelEnum } from "../../utils/security/token.security.js"
export const profile=asyncHandler(async(req,res,next)=>{
   
   
   req.user.phone=await decryptEncryption({ciphertext:req.user.phone})
   
    return successResponse({res,message:"User profile",status:200,data:req.user})
})
export const getNewLogin=asyncHandler(async(req,res,next)=>{
 const user=req.user
 const credentials=await generateLogin({user})
    
         return successResponse({res,data:{credentials}})
      
})
