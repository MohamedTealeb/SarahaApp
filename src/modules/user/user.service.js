import { asyncHandler, successResponse } from "../../utils/response.js"

import { decryptEncryption, generateEncryption } from "../../utils/security/encryption.security.js"
import { generateLogin } from "../../utils/security/token.security.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js"
import * as DBService from "../../DB/db.service.js"
import { UserModel } from "../../DB/models/user.modle.js"
import { RevokeTokenModel } from "../../DB/models/revoke.token.model.js"
export const profile=asyncHandler(async(req,res,next)=>{
   
   
   req.user.phone=await decryptEncryption({ciphertext:req.user.phone})
   
    return successResponse({res,message:"User profile",status:200,data:{user:req.user}})
})
export const Shareprofile=asyncHandler(async(req,res,next)=>{
   
   
   const {userId}=req.params
   const  user=await DBService.findOne({model:UserModel,filter:{_id:userId},select:"-password -role"})
   if(!user){
    return next(new Error("Not register acc",{cause:404}))
   }
    return user ? successResponse({res,message:"User profile",status:200,data:user})
    :next(new Error("Not register acc",{cause:404}))
})


export const getNewLogin=asyncHandler(async(req,res,next)=>{
 const user=req.user
 const credentials=await generateLogin({user})
    
         return successResponse({res,data:{credentials}})
      
})

export const updateProfile=asyncHandler(async(req,res,next)=>{
   if (req.body.phone){
    req.body.phone=await generateEncryption({plaintext:req.body.phone})
   }
    const user=await DBService.findOneAndUpdate({model:UserModel,filter:{_id:req.user._id},data:{$set:req.body,$inc:{__v:1}}})
   
    return user?successResponse({res,data:{user}}):next(new Error("Not register acc",{cause:404}))
})

export const freezeAccount=asyncHandler(async(req,res,next)=>{
   const userId=req.params.userId || req.user._id
   const user=await DBService.findOneAndUpdate({model:UserModel,filter:{_id:userId},data:{freezeAt:Date.now(),$inc:{__v:1}}})
   
   if(!user){
    return next(new Error("User not found",{cause:404}))
   }
   
   return successResponse({res,data:{user},message:"Account frozen successfully"})
})

export const restoreAccount=asyncHandler(async(req,res,next)=>{
   const userId=req.params.userId || req.user._id
   const user=await DBService.findOneAndUpdate({model:UserModel,filter:{_id:userId},data:{$unset:{freezeAt:true},$inc:{__v:1}}})
   
   if(!user){
    return next(new Error("User not found",{cause:404}))
   }
   
   return successResponse({res,data:{user},message:"Account restored successfully"})
})

export const harddeleteAccount=asyncHandler(async(req,res,next)=>{
   const userId=req.params.userId || req.user._id
   const user=await DBService.findOneAndDelete({model:UserModel,filter:{_id:userId}})
   
   if(!user){
    return next(new Error("User not found",{cause:404}))
   }
   
   return successResponse({res,data:{},message:"Account deleted successfully"})
})

export const updatePassword=asyncHandler(async(req,res,next)=>{
   const {currentPassword,newPassword}=req.body
   
   // Get user with password
   const user=await DBService.findOne({model:UserModel,filter:{_id:req.user._id},select:"+password"})
   
   if(!user){
    return next(new Error("User not found",{cause:404}))
   }
   
   // Verify current password
   const isMatch=await compareHash({plaintext:currentPassword,hash:user.password})
   
   if(!isMatch){
    return next(new Error("Current password is incorrect",{cause:400}))
   }
   
   // Hash new password
   const hashedPassword=await generateHash({plaintext:newPassword})
   
   // Update password
   const updatedUser=await DBService.findOneAndUpdate({model:UserModel,filter:{_id:req.user._id},data:{password:hashedPassword,changeLoginCredentials:Date.now(),$inc:{__v:1}}})
   
   return successResponse({res,data:{},message:"Password updated successfully"})
})
export const logout=asyncHandler(async(req,res,next)=>{
 
 
    await DBService.create({
    model:RevokeTokenModel,
    data:{

        idToken:req.decoded.decoded.jti,
        expiresAccessDate:req.decoded.decoded.exp,
        expiresRefreshDate:req.decoded.decoded.exp +31536000
    }
      
  })
  return successResponse({res,data:{}})
})