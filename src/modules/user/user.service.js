import { asyncHandler, successResponse } from "../../utils/response.js"

import { decryptEncryption, generateEncryption } from "../../utils/security/encryption.security.js"
import { generateLogin } from "../../utils/security/token.security.js"
import * as DBService from "../../DB/db.service.js"
import { UserModel } from "../../DB/models/user.modle.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js"
export const profile=asyncHandler(async(req,res,next)=>{
   
   // Only decrypt phone for local users
   if(req.user.provider === "local" && req.user.phone){
       req.user.phone=await decryptEncryption({ciphertext:req.user.phone})
   }
   
    return successResponse({res,message:"User profile",status:200,data:req.user})
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
    const user=await DBService.findOneAndUpdate({model:UserModel,filter:{_id:req.user.user._id},data:{$set:req.body,$inc:{__v:1}}})
   
    return user?successResponse({res,data:{user}}):next(new Error("Not register acc",{cause:404}))
})
export const freezeAccount=asyncHandler(async(req,res,next)=>{
    
    const {userId}=req.params
    if(userId && req.user.user.role!="admin"){
        return next(new Error("Not authorized",{cause:403}))
    }
    const targetUserId = userId || req.user.user._id
    const user=await DBService.updateOne({
        model:UserModel,filter:{
            _id:targetUserId,
            freezeAt:{$exists:false}
        },
        data:{$set:{freezeAt:Date.now(),freezeBy:req.user.user._id},$inc:{__v:1}}})
   
    return user.modifiedCount?successResponse({res,message:"Account frozen successfully",data:{}}):next(new Error("Account not found or already frozen",{cause:404}))
})
export const restoreAccount=asyncHandler(async(req,res,next)=>{
    
    const {userId}=req.params
    if(userId && req.user.user.role!="admin"){
        return next(new Error("Regular user can't restore account",{cause:403}))
    }
    const targetUserId = userId || req.user.user._id
    const user=await DBService.updateOne({
        model:UserModel,filter:{
            _id:targetUserId,
            freezeAt:{$exists:true}
        },
        data:{
            $unset:{freezeAt:1, freezeBy:1},
            $inc:{__v:1}
        }})
   
    return user.modifiedCount?successResponse({res,message:"Account restored successfully",data:{}}):next(new Error("Account not found or not frozen",{cause:404}))
})
export const harddeleteAccount=asyncHandler(async(req,res,next)=>{
    
    const {userId}=req.params
    if(userId && req.user.user.role!="admin"){
        return next(new Error("Regular user can't delete account",{cause:403}))
    }
    const targetUserId = userId || req.user.user._id
    const user=await UserModel.deleteOne({
        _id:targetUserId,
        freezeAt:{$exists:true}
    })
   
    return user.deletedCount?successResponse({res,message:"Account deleted successfully",data:{}}):next(new Error("Account not found or not frozen",{cause:404}))
})
export const updatePassword=asyncHandler(async(req,res,next)=>{

const {oldPassword,password}=req.body
if(!await compareHash({plaintext:oldPassword,hash:req.user.user.password}))
    return next(new Error("Invalid old password",{cause:400}))
for(const Hash of req.user.user.oldPassword ||[]){
    if(await compareHash({plaintext:password,hash:Hash}))
    return next(new Error("User has used this password before",{cause:400}))
}
  const hash=await generateHash({plaintext:password})
  const user=await DBService.updateOne({model:UserModel,filter:{_id:req.user.user._id},data:{
    $set:{password:hash},
    $push:{oldPassword:req.user.user.password},
    $inc:{__v:1}}})
  return user.modifiedCount? successResponse({res,message:"Password updated successfully",data:{}}):next(new Error("Failed to update password",{cause:400}))
    
})