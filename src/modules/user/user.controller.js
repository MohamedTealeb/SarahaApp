import { authentication } from "../../middleware/authentication.middleware.js";
import*as userService from "./user.service.js"
import {Router} from "express";

const router=Router()
router.get('/',authentication(),userService.profile)
export default router
