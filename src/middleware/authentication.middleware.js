import { asyncHandler } from "../utils/response.js"

import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js"

export const authentication=({tokenType=tokenTypeEnum.Access}={})=>{
    return asyncHandler(async(req,res,next)=>{
       req.user=await decodedToken({next,authorization:req.headers.authorization,tokenType})
       return next()
    })
}