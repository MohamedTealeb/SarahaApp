import*as userService from "./user.service.js"
import {Router} from "express";

const router=Router()
router.get('/',userService.profile)
export default router
