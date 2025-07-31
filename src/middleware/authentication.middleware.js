import { asyncHandler } from "../utils/response.js"

import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js"

export const authentication=({tokenType=tokenTypeEnum.Access}={})=>{
    return asyncHandler(async(req,res,next)=>{
       req.user=await decodedToken({next,authorization:req.headers.authorization,tokenType})
       return next()
    })
}
export const authorization=({accessRoles=[]}={})=>{
    return asyncHandler(async(req,res,next)=>{
        console.log("User:", req.user)
       if(!accessRoles.includes(req.user.user.role)){
        return next(new Error("Unauthorized",{cause:403}))
       }
       return next()
    })
}

export const auth =({tokenType=tokenTypeEnum.Access,accessRoles=[]}={})=>{
    return asyncHandler(async(req,res,next)=>{
        console.log("User:", req.user)
        req.user=await decodedToken({next,authorization:req.headers.authorization,tokenType})
        if(!accessRoles.includes(req.user.role)){
            return next(new Error("Unauthorizeddddd",{cause:403}))
           }
           return next()
    })
}