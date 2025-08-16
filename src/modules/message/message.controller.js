import { validation } from '../../middleware/validation.middleware.js';
import { cloudFileUpload } from '../../utils/multer/cLoud.multer.js';
import * as messageService from'./message.service.js'
import * as validators from'./message.validation.js'
import {Router} from'express'
const router=Router();

router.post("/:receiverId",cloudFileUpload().array("attachments",2),validation(validators.sendMessage),messageService.sendMessage)
export default router