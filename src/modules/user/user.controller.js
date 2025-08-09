import * as auth from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidators, localFileUpload } from "../../utils/multer/local.multer.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import*as userService from "./user.service.js"
import*as validators from "./user.validation.js"
import {Router} from "express";

const router=Router()
router.get('/refresh-token',auth.auth({tokenType:tokenTypeEnum.Refresh}),userService.getNewLogin)
router.get('/',auth.auth({accessRoles:["user","admin"]}),userService.profile)
router.get('/:userId/profile',validation(validators.shareProfile),userService .Shareprofile)
router.patch("/",auth.authentication(),validation(validators.updateProfile),userService.updateProfile)
router.patch(
    "/image",
    auth.authentication(),
    localFileUpload({
      customPath: "user",
      fileValidation: fileValidators.image
    }).array("attchment", 2),
    userService.ProfileImage
  );
  router.delete("/freeze",auth.authentication(),userService.freezeAccount)
router.delete("/:userId/freeze",auth.authentication(),validation(validators.freezeAccount),userService.freezeAccount)
router.patch("/restore",auth.authentication(),userService.restoreAccount)
router.patch("/:userId/restore",auth.authentication(),validation(validators.restoreAccount),userService.restoreAccount)
router.delete("/harddelete",auth.authentication(),userService.harddeleteAccount)
router.delete("/:userId/harddelete",auth.authentication(),validation(validators.harddeleteAccount),userService.harddeleteAccount)
router.patch("/password",auth.authentication(),validation(validators.updatePassword),userService.updatePassword)
router.post("/logout",auth.authentication(),userService.logout)
export default router
