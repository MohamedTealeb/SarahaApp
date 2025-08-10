import { uploadFile } from "../../utils/multer/cloudinary.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from '../../DB/db.service.js'
import { UserModel } from "../../DB/models/user.modle.js";
import { MessageModel } from "../../DB/models/Message.model.js";

export const sendMessage=asyncHandler(
    async(req,res,next)=>{
        const {receiverId}=req.params
        const checkUserExist=await DBService.findOne({
            model:UserModel ,
            filter:{
                _id:receiverId,
                deletedAt:{$exists:false},
                confirmEmail:{$exists:true},
            }
        })
        if(!checkUserExist){
 return next(new Error("Invalid receiver", { cause: 404 }))
        }
        const {content}=req.body
        let attachments=[]
        if(req.files?.length)
            {
                attachments=await uploadFile({file:req.file,path:`message/${receiverId}`})
        }
        const message=await DBService.create({
            model:MessageModel,
            data:[
                {

                    content,
                    attachments,
                    receivedBy:receiverId

                }
            ]
        })

        return successResponse({status:201,res,data:{message}})
    }
)