import { asyncHandler, successResponse } from "../../utils/response.js"
import * as DBService from "../../DB/db.service.js"
import { UserModel } from "../../DB/models/user.modle.js"
import { decryptEncryption } from "../../utils/security/encryption.security.js";
import jwt from "jsonwebtoken"
export const profile=asyncHandler(async(req,res,next)=>{
   
   
   
    return successResponse({res,messsage:"User profile",status:200,data:req.user})
})