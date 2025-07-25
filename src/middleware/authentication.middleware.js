import { asyncHandler } from "../utils/response.js"
import * as DBService from "../DB/db.service.js"
import { UserModel } from "../DB/models/user.modle.js"
import { verifyToken } from "../utils/security/token.security.js"

export const authentication=()=>{
    return asyncHandler(async(req,res,next)=>{
        const {authorization}=req.headers
        const decoded=await verifyToken({token:authorization})
        if(!decoded?._id){
            return next(new Error("Invalid token",{cause:400}))
        }
        const user=await DBService.findById({model:UserModel,id:decoded._id})
        if(!user){
            return next(new Error("User not found",{cause:404}))
        }
        req.user=user
        return next()
    })
}