import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { jobLocationTypes, seniorityLevelTypes, statusTypes, workingTimeTypes } from "../../DB/enums.js";

//---------------------------------------------------------------------------------------------------------------

// add job schema
export const addJobSchema = {
    body: joi.object({
        jobTitle: joi.string().min(3).required(),
        jobLocation: joi.string().valid(
            jobLocationTypes.onsite, jobLocationTypes.remotely, jobLocationTypes.hybrid
        ).required(),
        workingTime: joi.string().valid(
            workingTimeTypes.fullTime, workingTimeTypes.partTime
        ).required(),
        seniorityLevel: joi.string().valid(
            seniorityLevelTypes.fresh, seniorityLevelTypes.junior, seniorityLevelTypes.midLevel, 
            seniorityLevelTypes.senior, seniorityLevelTypes.teamLeader, seniorityLevelTypes.CTO
        ).required(),
        jobDescription: joi.string().min(3).required(),
        technicalSkills: joi.array().items(joi.string()).required(),
        softSkills: joi.array().items(joi.string()).required()
    }).required(),
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// update job schema
export const updateJobSchema = {
    body: joi.object({
        jobTitle: joi.string().min(3),
        jobLocation: joi.string().valid(
            jobLocationTypes.onsite, jobLocationTypes.remotely, jobLocationTypes.hybrid
        ),
        workingTime: joi.string().valid(
            workingTimeTypes.fullTime, workingTimeTypes.partTime
        ),
        seniorityLevel: joi.string().valid(
            seniorityLevelTypes.fresh, seniorityLevelTypes.junior, seniorityLevelTypes.midLevel, 
            seniorityLevelTypes.senior, seniorityLevelTypes.teamLeader, seniorityLevelTypes.CTO
        ),
        jobDescription: joi.string().min(3),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string())
    }),
    params: joi.object({
        companyId: generalRules.objectId.required(),
        jobId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// freeze job schema
export const freezeJobSchema = {
    params: joi.object({
        jobId: generalRules.objectId.required(),
        companyId: generalRules.objectId.required()
    })
};

//---------------------------------------------------------------------------------------------------------------

// close job schema
export const closeJobSchema = {
    params: joi.object({
        jobId: generalRules.objectId.required(),
        companyId: generalRules.objectId.required()
    })
};

//---------------------------------------------------------------------------------------------------------------

// get jobs schema
export const getJobsSchema = {
    params: joi.object({
        jobId: generalRules.objectId,
        companyId: generalRules.objectId.required()
    })
};

//---------------------------------------------------------------------------------------------------------------

// get jobs by filter schema
export const getByFilterSchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }),
    body: joi.object({
        jobTitle: joi.string().min(3),
        jobLocation: joi.string().valid(
            jobLocationTypes.onsite, jobLocationTypes.remotely, jobLocationTypes.hybrid
        ),
        workingTime: joi.string().valid(
            workingTimeTypes.fullTime, workingTimeTypes.partTime
        ),
        seniorityLevel: joi.string().valid(
            seniorityLevelTypes.fresh, seniorityLevelTypes.junior, seniorityLevelTypes.midLevel, 
            seniorityLevelTypes.senior, seniorityLevelTypes.teamLeader, seniorityLevelTypes.CTO
        ),
        technicalSkills: joi.array().items(joi.string()),
    })
};

//---------------------------------------------------------------------------------------------------------------

// get applications schema
export const getApplicationsSchema = {
    params: joi.object({
        jobId: generalRules.objectId.required(),
        companyId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// update applications schema
export const updateAppStatusSchema = {
    params: joi.object({
        jobId: generalRules.objectId.required(),
        companyId: generalRules.objectId.required(),
        applicationId: generalRules.objectId.required()
    }).required(),
    body: joi.object({
        status: joi.string().valid(
            statusTypes.accepted, statusTypes.inConsideration, statusTypes.rejected, statusTypes.viewed, statusTypes.pending
        ).required()
    })
};