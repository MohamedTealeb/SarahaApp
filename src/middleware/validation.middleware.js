import { asyncHandler } from "../utils/response.js"
import Joi from "joi"

export const generalFields={

 email:Joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:["com","net","org","io","sa"]}).required(),
  password:Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),

      fullName:Joi.string().required(),
            confirmPassword:Joi.string().required().valid(Joi.ref("password")),
            phone:Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required(),
            otp:Joi.string().pattern(new RegExp(/^\d{6}$/)).required(),
    

}

export const validation=(schema)=>{

    return asyncHandler(
        async(req,res,next)=>{
        const validationError=[]
        for(const key of Object.keys(schema)){
            const validationResult=schema[key].validate(req[key])
            if(validationResult.error){
        
                validationError.push({key,details:validationResult.error.details.map(ele=>{
                    return{message:ele.message,path:ele.path[0]}
                })})
                
            }
        }
        if(validationError.length){
            return res.status(400).json({message:"Validation Error",errors:validationError})
        }
        return next()
        }
    )

}
// export const validationQuery=(schema)=>{

//     return asyncHandler(
//         async(req,res,next)=>{
//             const validationResult=schema.validate({...req.query})
//             if(validationResult.error){
//                 return res.status(400).json({message:validationResult.error.details[0].message})
//             }
//             return next()
//         }
//     )

// }

