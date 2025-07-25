import { asyncHandler, successResponse } from "../../utils/response.js"
import * as DBService from "../../DB/db.service.js"
import { UserModel } from "../../DB/models/user.modle.js"
import { decryptEncryption } from "../../utils/security/encryption.security.js";
import jwt from "jsonwebtoken"
export const profile=asyncHandler(async(req,res,next)=>{
    const {authorization}=req.headers
    const decoded=jwt.verify(authorization,"secret key 123")
    const user=await DBService.findById({model:UserModel,id:decoded._id})
    user.phone=await decryptEncryption({ciphertext:user.phone})
    return successResponse({res,messsage:"User profile",status:200,data:user})
})