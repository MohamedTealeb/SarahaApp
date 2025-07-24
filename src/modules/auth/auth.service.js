import { UserModel } from "../../DB/models/user.modle.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js"

export const login=asyncHandler(
    async(req,res,next)=>{
  
      const {email,password}=req.body
    const user=await DBService.findOne({model:UserModel,filter:{email,password},select:"-password"})
      if(!user){
        return next(new Error("User not found",{cause:404}))
      }
      return successResponse({res,messsage:"User logged in successfully",status:200,data:user})
   
    
}
)

export const signup=asyncHandler(
    async(req,res,next)=>{
      
            const {fullName,email,password,phone}=req.body
          
            if( await DBService.findOne({model:UserModel,filter:{email}})){
              return next(new Error("User already exists",{cause:409}))
            }
            const user=await DBService.create({model:UserModel,data:{fullName,email,password,phone}})
            return successResponse({res,messsage:"User created successfully",status:201,data:user})
          
    }
)

