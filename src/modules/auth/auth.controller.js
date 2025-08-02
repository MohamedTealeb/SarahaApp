import* as validators from "./auth.validation.js";
import*as authService from "./auth.service.js"
import {Router} from "express";
import { validation } from "../../middleware/validation.middleware.js";
const router=Router()
router.post('/signup',validation(validators.signup),authService.signup)
router.patch('/confirm-email',validation(validators.confirmEmail),authService.confirmEmail)
router.post('/signup/gmail',validation(validators.signupGmail),authService.signupGmail)
router.post('/login',validation(validators.login),authService.login)
router.post('/login/gmail',validation(validators.loginGmail),authService.loginGmail)
router.patch("/send-forgot-password",validation(validators.sendForgotPassword),authService.sendForgotPassword)
router.patch("/verify-forgot-password",validation(validators.verifyForgotPassword),authService.verifyForgotPassword)
router.patch("/reset-forgot-password",validation(validators.resetForgotPassword),authService.resetForgotPassword)
export default router
