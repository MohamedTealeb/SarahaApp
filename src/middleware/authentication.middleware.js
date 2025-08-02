import { asyncHandler } from "../utils/response.js"

import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js"

export const authentication=({tokenType=tokenTypeEnum.Access}={})=>{
    return asyncHandler(async(req,res,next)=>{
       try {
           const decoded = await decodedToken({next,authorization:req.headers.authorization,tokenType})
           if(!decoded || !decoded.user){
               return next(new Error("Invalid token or user not found",{cause:401}))
           }
           req.user = decoded.user
           req.decoded=decoded
         
           
           return next()
       } catch (error) {
           return next(new Error(error.message,{cause:401}))
       }
    })
}
export const authorization=({accessRoles=[]}={})=>{
    return asyncHandler(async(req,res,next)=>{
       if(!req.user){
        return next(new Error("User not authenticated",{cause:401}))
       }
       if(!accessRoles.includes(req.user.role)){
        return next(new Error("Unauthorized",{cause:403}))
       }
       return next()
    })
}

export const auth =({tokenType=tokenTypeEnum.Access,accessRoles=[]}={})=>{
    return asyncHandler(async(req,res,next)=>{
        try {
            const decoded = await decodedToken({ next, authorization: req.headers.authorization, tokenType });
            if(!decoded || !decoded.user){
                return next(new Error("Invalid token or user not found",{cause:401}))
            }
            req.user = decoded.user;
            req.decoded=decoded
            if(accessRoles.length > 0 && !accessRoles.includes(req.user.role)){
                return next(new Error("Unauthorized",{cause:403}))
            }
               return next()
        } catch (error) {
            return next(new Error(error.message,{cause:401}))
        }
    })
}