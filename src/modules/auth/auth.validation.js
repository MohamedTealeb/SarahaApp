import Joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"
export const login={
    body:Joi.object().keys({
        email:generalFields.email.required(),
        password:generalFields.password.required(),  
    }).required()
}



export const signup={
    body:Joi.object().keys({
        email:generalFields.email.required(),
        password:generalFields.password.required(),
        fullName:generalFields.fullName.required(),
        // confirmPassword:generalFields.confirmPassword.required(),
        phone:generalFields.phone
    }).required(),
    query:Joi.object().keys({
        lang:Joi.string().valid("ar","en").required()
    })

}
export const confirmEmail={
    body:Joi.object().keys({
        email:generalFields.email.required(),
        otp:generalFields.otp.required(),
    }).required()
}
export const loginGmail={
    body:Joi.object().keys({
        idToken:Joi.string().required(),
    }).required()
}
export const signupGmail={
    body:Joi.object().keys({
        idToken:Joi.string().token().required(),
    }).required()
}