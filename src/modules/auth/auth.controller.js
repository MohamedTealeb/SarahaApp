import*as authService from "./auth.service.js"
import {Router} from "express";

const router=Router()
router.post('/signup',authService.signup)
router.post('/signup/gmail',authService.signupGmail)
router.post('/login',authService.login)
router.post('/login/gmail',authService.loginGmail)
export default router
