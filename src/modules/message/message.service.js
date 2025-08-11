import { uploadFile } from "../../utils/multer/cloudinary.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from '../../DB/db.service.js';
import { UserModel } from "../../DB/models/user.modle.js";
import { MessageModel } from "../../DB/models/Message.model.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
    const { receiverId } = req.params;

 
    const checkUserExist = await DBService.findOne({
        model: UserModel,
        filter: {
            _id: receiverId,
            deletedAt: { $exists: false },
            confirmEmail: { $exists: true },
        }
    });

    if (!checkUserExist) {
        return next(new Error("invalid receiver", { cause: 404 }));
    }

    const { content } = req.body;
    let attachments = [];


    if (req.files?.length) {
        attachments = await Promise.all(
            req.files.map(file =>
                uploadFile({ file, path: `message/${receiverId}` })
            )
        );
    }

   
    const message = await DBService.create({
        model: MessageModel,
        data: {
            content,
            attachments,
            receivedBy: receiverId
        }
    });

    return successResponse({
        status: 201,
        res,
        data: { message }
    });
});
export const getMessages = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;
    const messages = await DBService.find({
        model: MessageModel,
        filter: { receivedBy: userId },
        populate: [
            {
                path: "receivedBy",
                select: "firstName lastName picture"
            }
        ],
    });
    return successResponse({
        status: 200,
        res,
        data: { messages }
    });
});

