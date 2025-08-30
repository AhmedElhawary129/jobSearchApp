import { Router } from "express";
import * as AS from "./application.service.js";
import * as AV from "./application.validation.js";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { multerHost } from "../../middleware/multer.js";
import { fileTypes } from "../../DB/enums.js";

//---------------------------------------------------------------------------------------------------------------

// marge params
const applicationRouter = Router({mergeParams: true});

//---------------------------------------------------------------------------------------------------------------

// routes
applicationRouter.post(
  "/addApplication",
  multerHost([...fileTypes.pdf]).single("userCV"),
  validation(AV.addApplicationSchema),
  authentication,
  AS.addApplication
);


applicationRouter.get(
  "/myApplication",
  validation(AV.myApplicationSchema),
  authentication,
  AS.myApplication
);

export default applicationRouter;
