import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const shareProfile={
    params:Joi.object().keys({
        userId:generalFields.userId.required(),
        // userId:Joi.string().hex().length(24).required(),
    }).required()
}

export const updateProfile={
    body:Joi.object().keys({
        firstName:generalFields.fullName,
        lastName:generalFields.fullName,
        phone:generalFields.phone,
        gender:Joi.string().valid("male","female"),

    }).required()
}
export const freezeAccount={
   params:Joi.object().keys({
    userId:generalFields.userId
   })
}
export const restoreAccount={
   params:Joi.object().keys({
    userId:generalFields.userId
   })
}
export const harddeleteAccount={
   params:Joi.object().keys({
    userId:generalFields.userId
   })
}

export const updatePassword={

  body:Joi.object().keys({
  currentPassword:generalFields.password.required(),
   newPassword:generalFields.password.not(Joi.ref("currentPassword")).required(),
  }).required()
}

export const updateProfileImage={
    file:Joi.object().keys({
      fieldname:Joi.string(),
      originalname:Joi.string(),
      encoding:Joi.string(),
      destination:Joi.string(),
      filename:Joi.string(),
      path:Joi.string(),
      size:Joi.number(),
      mimetype:Joi.string(),
    }).required()
}