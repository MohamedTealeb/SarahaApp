import* as validators from "../../middleware/validation.middleware.js";
import*as authService from "./auth.service.js"
import {Router} from "express";
import { validation } from "../../middleware/validation.middleware.js";
const router=Router()
router.post('/signup',validation(validators.signup),authService.signup)
router.patch('/confirm-email',validation(validators.confirmEmail),authService.confirmEmail)
router.post('/signup/gmail',validation(validators.signupGmail),authService.signupGmail)
router.post('/login',validation(validators.login),authService.login)
router.post('/login/gmail',validation(validators.loginGmail),authService.loginGmail)
export default router
