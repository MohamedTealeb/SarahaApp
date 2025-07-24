import*as userService from "./user.service.js"
import {Router} from "express";

const router=Router()
router.get('/profile',userService.profile)
export default router
