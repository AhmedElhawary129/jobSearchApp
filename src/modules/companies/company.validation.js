import joi from "joi";
import { generalRules } from "../../utils/index.js";

//---------------------------------------------------------------------------------------------------------------

// add company schema
export const addCompanySchema = {
    body: joi.object({
        companyName: joi.string().min(3).required(),
        description: joi.string().min(3).required(),
        industry: joi.string().min(3).required(),
        address: joi.string().min(3).required(),
        numberOfEmployees: joi.number().min(20).max(500).required(),
        companyEmail: generalRules.email.required()
    }).required(),
    file: generalRules.file
};

//---------------------------------------------------------------------------------------------------------------

// update company schema
export const updateCompanySchema = {
    body: joi.object({
        companyName: joi.string().min(3),
        description: joi.string().min(3),
        industry: joi.string().min(3),
        address: joi.string().min(3),
        numberOfEmployees: joi.number().min(20).max(500),
        companyEmail: generalRules.email
    }),
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// freeze company schema
export const freezeCompanySchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// freeze company schema
export const getCompanySchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// Search for a company with a name schema
export const searchByNameSchema = {
    body: joi.object({
        companyName: joi.string().min(3).required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// upload logo schema
export const uploadLogoSchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required(),
    file: generalRules.file.required()
};

//---------------------------------------------------------------------------------------------------------------

// upload cover image schema
export const uploadCoverImageSchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required(),
    file: generalRules.file.required()
};

//---------------------------------------------------------------------------------------------------------------

// delete logo schema
export const deleteLogoSchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required()
};

//---------------------------------------------------------------------------------------------------------------

// delete logo schema
export const deleteCoverImageSchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required()
};