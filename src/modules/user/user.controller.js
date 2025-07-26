import { authentication } from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import*as userService from "./user.service.js"
import {Router} from "express";

const router=Router()
router.get('/',authentication(),userService.profile)
router.get('/refresh-token',authentication({tokenType:tokenTypeEnum.Refresh}),userService.getNewLogin)

export default router
