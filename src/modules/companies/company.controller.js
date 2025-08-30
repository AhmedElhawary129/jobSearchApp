import { Router } from "express";
import * as CS from "./company.service.js";
import * as CV from "./company.validation.js";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { multerHost } from "../../middleware/multer.js";
import { fileTypes } from "../../DB/enums.js";
import jobRouter from "../jobs/job.controller.js";

//---------------------------------------------------------------------------------------------------------------

// marge params
const companyRouter = Router({mergeParams: true});
companyRouter.use("/:companyId/jobs", jobRouter);

//---------------------------------------------------------------------------------------------------------------

// routes
companyRouter.post(
  "/addCompany",
  multerHost([...fileTypes.image, ...fileTypes.pdf]).single("legalAttachment"),
  validation(CV.addCompanySchema),
  authentication,
  CS.addCompany
);

companyRouter.patch(
  "/updateCompany/:companyId",
  validation(CV.updateCompanySchema),
  authentication,
  CS.updateCompany
);

companyRouter.delete(
  "/freezeCompany/:companyId",
  validation(CV.freezeCompanySchema),
  authentication,
  CS.freezeCompany
);

companyRouter.patch(
  "/unFreezeCompany/:companyId",
  validation(CV.freezeCompanySchema),
  authentication,
  CS.unFreezeCompany
);

companyRouter.get("/getCompany/:companyId", 
  validation(CV.getCompanySchema),
  authentication, 
  CS.getCompanyWithJobs
);


companyRouter.get(
  "/searchByName",
  validation(CV.searchByNameSchema),
  authentication,
  CS.searchByName
);

companyRouter.patch(
  "/uploadLogo/:companyId",
  multerHost(fileTypes.image).single("logo"),
  validation(CV.uploadLogoSchema),
  authentication,
  CS.uploadLogo
);

companyRouter.patch(
  "/uploadCoverImage/:companyId",
  multerHost(fileTypes.image).single("coverImage"),
  validation(CV.uploadCoverImageSchema),
  authentication,
  CS.uploadCoverImage
);

companyRouter.delete(
  "/deleteLogo/:companyId",
  validation(CV.deleteLogoSchema),
  authentication,
  CS.deleteLogo
);
companyRouter.delete(
  "/deleteCoverImage/:companyId",
  validation(CV.deleteCoverImageSchema),
  authentication,
  CS.deleteCoverImage
);

export default companyRouter;
