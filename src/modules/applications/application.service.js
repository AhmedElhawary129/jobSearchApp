import * as dbService from "../../DB/dbService.js";
import { applicationModel, companyModel, jobModel } from "../../DB/models/index.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/index.js";

//---------------------------------------------------------------------------------------------------------------

// add application
export const addApplication = asyncHandler(async(req, res, next) => {
    const {jobId, companyId} = req.params;

    if (!await dbService.findOne({
        model: companyModel, 
        filter: {_id: companyId, isDeleted: false, isBanned: false}
    })) {
        return next(new AppError("Company not found", 404))
    }

    if (!await dbService.findOne({
        model: jobModel, 
        filter: {_id: jobId, closed: false, frozen: false}
    })) {
        return next(new AppError("Job not found", 404))
    }

if (!req.file) {
        return next(new AppError("The CV is required", 400))
    }
    const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {
        folder: `jobSearchApp/applications/${req.user._id}/CV`
    })
    req.body.userCV = {public_id, secure_url}

    const application = await dbService.create({
        model: applicationModel, 
        query: {...req.body, jobId, companyId, userId: req.user._id}
    })
    return res.status(201).json({msg: "Application added successfully", application})
})

//-----------------------------------------------------------------------------------------------------------------

// my application
export const myApplication = asyncHandler(async(req, res, next) => {
    const {jobId, companyId} = req.params;

    if (!await dbService.findOne({
        model: companyModel, 
        filter: {_id: companyId, isDeleted: false, isBanned: false}
    })) {
        return next(new AppError("Company not found", 404))
    }

    if (!await dbService.findOne({
        model: jobModel, 
        filter: {_id: jobId, closed: false, frozen: false}
    })) {
        return next(new AppError("Job not found", 404))
    }

    const myApplication = await dbService.findOne({
        model: applicationModel,
        filter: {userId: req.user._id, companyId, jobId},
        populate: [
            {path: "jobId", select: "jobTitle -_id"},
            {path: "companyId", select: "companyName -_id"},
            {path: "userId", select: "firstName lastName -_id"},
        ]
    })
    if (!myApplication) {
        return next(new AppError("Application not found", 404))
    }
    return res.status(201).json({msg: `Your application is ${myApplication.status}`, Application: myApplication})
})