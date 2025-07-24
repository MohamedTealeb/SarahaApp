export const asyncHandler=(fn)=>{
   return async(req,res,next)=>{
    await   fn(req,res,next).catch(error=>{
        
       return next(error,{cause:500})
    })
   }
       
     
    
}
export const globalErrorHandling=(error,req,res,next)=>{
    return res.status(error.cause||400).json({message:error.message,srack:error.stack})
}
export const successResponse=({res,message="Done",status=status,data={}})=>{
    return res.status(status).json({message,data})
}       