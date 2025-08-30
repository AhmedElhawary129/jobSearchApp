import joi from "joi";
import { generalRules } from "../../utils/index.js";

//---------------------------------------------------------------------------------------------------------------

// add company schema
export const addApplicationSchema = {
    body: joi.object({
        userEmail: generalRules.email.required()
    }).required,
    params: joi.object({
        companyId: generalRules.objectId.required(),
        jobId: generalRules.objectId.required(),
    }).required(),
    file: generalRules.file.required()
};

//---------------------------------------------------------------------------------------------------------------

// my application schema
export const myApplicationSchema = {
    params: joi.object({
        companyId: generalRules.objectId,
        jobId: generalRules.objectId,
    })
};