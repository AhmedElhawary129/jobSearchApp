import { Router } from "express";
import * as JS from "./job.service.js";
import * as JV from "./job.validation.js";
import { authentication } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import applicationRouter from "../applications/application.controller.js";

//---------------------------------------------------------------------------------------------------------------

// marge params
const jobRouter =  Router({ mergeParams: true });
jobRouter.use("/:jobId/applications", applicationRouter)

//---------------------------------------------------------------------------------------------------------------

// routes
jobRouter.post("/addJob", 
    validation(JV.addJobSchema), 
    authentication,
    JS.addJob
);

jobRouter.patch("/updateJob/:jobId", 
    validation(JV.updateJobSchema), 
    authentication, 
    JS.updateJob
)

jobRouter.delete("/freezeJob/:jobId", 
    validation(JV.freezeJobSchema), 
    authentication,
    JS.freezeJob
);


jobRouter.patch("/unFreezeJob/:jobId", 
    validation(JV.freezeJobSchema), 
    authentication,
    JS.unFreezeJob
);

jobRouter.patch("/closeJob/:jobId", 
    validation(JV.closeJobSchema), 
    authentication,
    JS.closeJob
);

jobRouter.get("/getJobs/:jobId?", 
    validation(JV.getJobsSchema),
    authentication,
    JS.getJobs
);

jobRouter.get("/getByFilter", 
    validation(JV.getByFilterSchema),
    authentication,
    JS.getByFilter
);

jobRouter.get("/getApplications/:jobId", 
    validation(JV.getApplicationsSchema),
    authentication,
    JS.getApplications
);

jobRouter.patch("/updateAppStatus/:jobId/:applicationId", 
    validation(JV.updateAppStatusSchema),
    authentication,
    JS.updateAppStatus
)

export default jobRouter