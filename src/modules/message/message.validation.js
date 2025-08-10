import { generalFields } from "../../middleware/validation.middleware.js";
import Joi from "joi";
export const sendMessage={
    params:Joi.object().keys({
        receiverId:generalFields.userId.required(),
      
    }).required(),
    body:Joi.object().keys({
        content:Joi.string().min(2).max(20000)
    }),
    file:Joi.array().items(
        Joi.object().keys({

    fieldname:Joi.string(),
    originalname:Joi.string(),
    encoding:Joi.string(),
    destination:Joi.string(),
    filename:Joi.string(),
    path:Joi.string(),
    size:Joi.number(),
    mimetype:Joi.string(),
}
)
).max(2)
}
   
