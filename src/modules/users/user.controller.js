import { Router } from "express";
import * as US from "./user.service.js";
import {validation} from "../../middleware/validation.js"
import * as UV from "./user.validation.js";
import { multerHost } from "../../middleware/multer.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { fileTypes, roleTypes } from "../../DB/enums.js";

//---------------------------------------------------------------------------------------------------------------

const userRouter = Router();

// routes
userRouter.post("/signUp", validation(UV.signUpSchema), US.signUp);
userRouter.patch("/confirmEmail", validation(UV.confirmEmailSchema), US.confirmEmail);

userRouter.post("/signIn", validation(UV.logInSchema), US.signIn);
userRouter.post("/loginWithGmail", US.loginWithGmail);

userRouter.patch("/forgetPassword", validation(UV.forgetPasswordSchema), US.forgetPassword);
userRouter.patch("/resetPassword", validation(UV.resetPasswordSchema), US.resetPassword);

userRouter.get("/refreshToken", validation(UV.refreshTokenSchema), US.refreshToken);

userRouter.patch("/updateProfile", validation(UV.updateProfileSchema), authentication, US.updateProfile);

userRouter.get("/getProfile", authentication, US.getProfile);
userRouter.get("/userProfile/:userId", validation(UV.userProfileSchema), authentication, US.userProfile);

userRouter.patch("/updatePassword", validation(UV.updatePasswordSchema), authentication, US.updatePassword);


userRouter.patch("/uploadProfileImage", 
    multerHost(fileTypes.image).single("profileImage"),
    validation(UV.uploadImageSchema), 
    authentication,
    US.uploadProfileImage
);

userRouter.patch("/uploadCoverImage", 
    multerHost(fileTypes.image).single("coverImage"),
    validation(UV.uploadImageSchema), 
    authentication,
    US.uploadCoverImage
);

userRouter.delete("/deleteProfileImage", authentication, US.deleteProfileImage);
userRouter.delete("/deleteCoverImage", authentication, US.deleteCoverImage);

userRouter.patch("/freezeAccount/:userId", validation(UV.freezeAccountSchema), authentication, US.freezeAccount);
userRouter.patch("/unFreezeAccount/:userId", validation(UV.freezeAccountSchema), authentication, US.unFreezeAccount);

userRouter.get("/shareProfile/:id", validation(UV.shareProfileSchema), authentication, US.shareProfile);

userRouter.patch("/updateEmail", validation(UV.updateEmailSchema), authentication, US.updateEmail);
userRouter.patch("/replaceEmail", validation(UV.replaceEmailSchema), authentication, US.replaceEmail);

userRouter.patch("/addFriend/:userId", authentication, validation(UV.friendSchema), US.addFriend);
userRouter.patch("/removeFriend/:userId", authentication, validation(UV.friendSchema), US.removeFriend);

userRouter.patch("/blockUser/:userId", authentication, validation(UV.blockUserSchema), US.blockUser);
userRouter.patch("/unBlockUser/:userId", authentication, validation(UV.blockUserSchema), US.unBlockUser);

userRouter.patch("/dashboard/updateRole/:userId", 
    authentication, 
    authorization([roleTypes.admin, roleTypes.superAdmin]), 
    US.updateRole
);

userRouter.patch("/dashboard/banUser/:userId", 
    authentication, 
    authorization([roleTypes.admin, roleTypes.superAdmin]), 
    US.banUser
);

userRouter.patch("/dashboard/unBanUser/:userId", 
    authentication, 
    authorization([roleTypes.admin, roleTypes.superAdmin]), 
    US.unBanUser
);

userRouter.patch("/dashboard/banCompany/:companyId", 
    authentication, 
    authorization([roleTypes.admin, roleTypes.superAdmin]), 
    US.banCompany
);

userRouter.patch("/dashboard/unBanCompany/:companyId", 
    authentication, 
    authorization([roleTypes.admin, roleTypes.superAdmin]), 
    US.unBanCompany
);

userRouter.patch("/dashboard/approveCompany/:companyId", 
    authentication, 
    authorization([roleTypes.admin, roleTypes.superAdmin]), 
    US.approveCompany
);

userRouter.get("/profile", authentication, US.profile);

export default userRouter  