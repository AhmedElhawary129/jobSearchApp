import * as dbService from "../../DB/dbService.js";
import { statusTypes } from "../../DB/enums.js";
import { applicationModel, companyModel, jobModel } from "../../DB/models/index.js";
import { AppError, asyncHandler, eventEmitter, pagination } from "../../utils/index.js";

//---------------------------------------------------------------------------------------------------------------

// add job
export const addJob = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,             
            $or: [
                {HRs: { $in: [req.user._id] }},
                {createdBy: req.user._id }
            ]
        }
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const jobExists = await dbService.findOne({
        model: jobModel,
        filter: {jobTitle: req.body.jobTitle, companyId}
    })
    if (jobExists) {
        return next(new AppError("This company has the same job", 409))
    }

    const job = await dbService.create({
        model: jobModel, 
        query: {...req.body, companyId, addedBy: req.user._id},
    })
    return res.status(201).json({msg: "Job added successfully", job})
})

//---------------------------------------------------------------------------------------------------------------

// update job
export const updateJob = asyncHandler(async(req, res, next) => {
    const {companyId, jobId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,             
            $or: [
                {HRs: { $in: [req.user._id] }},
                {createdBy: req.user._id }
            ]
        }
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    if (req.body.jobTitle) {
        const jobExists = await dbService.findOne({
            model: jobModel,
            filter: {jobTitle: req.body.jobTitle, companyId}
        })
        if (jobExists) {
            return next(new AppError("The same name of job already exists", 409))
        }
    }

    const job =  await dbService.findOneAndUpdate({
        model: jobModel, 
        filter: {_id: jobId, addedBy: req.user._id}, 
        update: {...req.body, updatedBy: req.user._id},
        options: {new: true}
    })
    if (!job) {
        return next(new AppError("Job not found or deleted or unauthorized", 404))
    }
    return res.status(200).json({msg: "Job updated successfully", job})
})

//---------------------------------------------------------------------------------------------------------------

// freeze job
export const freezeJob = asyncHandler(async(req, res, next) => {
    const {companyId, jobId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,
            $or: [
                {HRs: { $in: [req.user._id] }},
                {createdBy: req.user._id }
            ]
        } 
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const job = await dbService.findOneAndUpdate({
        model: jobModel, 
        filter: {_id: jobId, addedBy: req.user._id, frozen: false}, 
        update: {frozen: true, frozenBy: req.user._id}, 
        options: {new: true}
    })
    if (!job) {
        return next(new AppError("Job not found or already frozen or unauthorized", 404))
    }
    return res.status(200).json({msg: "Job frozen successfully", job})
})

//---------------------------------------------------------------------------------------------------------------

// unFreeze job
export const unFreezeJob = asyncHandler(async(req, res, next) => {
    const {companyId, jobId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,
            $or: [
                {HRs: {$in: [req.user._id]}},
                {createdBy: req.user._id}
            ]
        } 
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const job = await dbService.findOneAndUpdate({
        model: jobModel, 
        filter: {_id: jobId, frozenBy: req.user._id, frozen: true}, 
        update: {frozen: false, $unset: {frozenBy: 0}}, 
        options: {new: true}
    })
    if (!job) {
        return next(new AppError("Job not found or already unFrozen or unauthorized", 404))
    }
    return res.status(200).json({msg: "Job unFrozen successfully", job})
})

//---------------------------------------------------------------------------------------------------------------

// close job
export const closeJob = asyncHandler(async(req, res, next) => {
    const {companyId, jobId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,
            $or: [
                {HRs: { $in: [req.user._id] }},
                {createdBy: req.user._id }
            ]
        } 
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const job = await dbService.findOneAndUpdate({
        model: jobModel, 
        filter: {_id: jobId, addedBy: req.user._id, closed: false}, 
        update: {closed: true}, 
        options: {new: true}
    })
    if (!job) {
        return next(new AppError("Job not found or already closed or unauthorized", 404))
    }
    return res.status(200).json({msg: "Job closed successfully", job})
})

//---------------------------------------------------------------------------------------------------------------

// get all jobs or specific job
export const getJobs = asyncHandler(async(req, res, next) => {
    const {companyId, jobId} = req.params;

    if (req?.params?.jobId) {
        const specificJob = await dbService.findOne({
            model: jobModel,
            filter: {_id: jobId, frozen: false, closed: false, companyId},
            populate: [
                {path: "addedBy", select: "firstName lastName -_id"}, 
                {path: "companyId", select: "companyName -_id"}
            ]
        })
        if (!specificJob) {
            return next(new AppError("Job not found", 404))
        }
        return res.status(200).json({msg: "Job found", Job: specificJob})
    }


    let jobFilter = {companyId, closed: false, frozen: false};
    const totalCount = await jobModel.countDocuments(jobFilter);

    const {_page, data} = await pagination({
        model: jobModel,
        filter: {companyId, closed: false, frozen: false},
        populate: [
            {path: "addedBy", select: "firstName lastName -_id"}, 
            {path: "companyId", select: "companyName -_id"}
        ],
        sort: {createdAt: -1}
    }) 

    return res.status(200).json({msg: "Jobs found", Jobs: {_page, totalCount, data}})
})

//---------------------------------------------------------------------------------------------------------------

// get jobs by filter
export const getByFilter = asyncHandler(async(req, res, next) => {
    const {
        jobTitle,
        workingTime,
        jobLocation,
        seniorityLevel,
        technicalSkills
    } = req.body;

    let filter = { closed: false, frozen: false };

    if(workingTime) filter.workingTime = workingTime;
    if(jobLocation) filter.jobLocation = jobLocation;
    if(seniorityLevel) filter.seniorityLevel = seniorityLevel;
    
    if(jobTitle) {
        filter.jobTitle = {$regex: jobTitle, $options: "i"};
    };
    
    if(technicalSkills?.length) {
        filter.technicalSkills = {$in: technicalSkills};
    };

    const totalCount = await jobModel.countDocuments(filter);

    const {_page, data} = await pagination({
        model: jobModel,
        filter: filter,
        populate: [
            {path: "addedBy", select: "firstName lastName -_id"}, 
            {path: "companyId", select: "companyName -_id"}
        ],
        sort: {createdAt: -1},
        select: "jobTitle workingTime jobLocation seniorityLevel technicalSkills addedBy companyId -_id"
    }) 
    if (totalCount === 0) {
        return next(new AppError("No jobs found", 404))
    }
    return res.status(200).json({msg: "Jobs found", Jobs: {_page, totalCount, data}})
})

//---------------------------------------------------------------------------------------------------------------

// get all applications for specific job
export const getApplications = asyncHandler(async(req, res, next) => {
    const {companyId, jobId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,
            isBanned: false,
            $or: [
                {HRs: { $in: [req.user._id]}},
                {createdBy: req.user._id }
            ]
        } 
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const job = await dbService.findOne({
        model: jobModel,
        filter: {
            _id: jobId, companyId, closed: false, frozen: false
        }
    })
    if (!job) {
        return next(new AppError("Job not found", 404))
    }

    const totalCount = await applicationModel.countDocuments({companyId, jobId});

    const {_page, data} = await pagination({
        model: applicationModel,
        filter: {jobId, companyId},
        populate: [
            {path: "userId", select: "firstName lastName -_id"}
        ],
        sort: {createdAt: -1}
    }) 
    if (totalCount === 0) {
        return next(new AppError("No applications found", 404))
    }
    return res.status(200).json({msg: "Applications found", Applications: {_page, totalCount, data}})
})

//---------------------------------------------------------------------------------------------------------------

// update application status
export const updateAppStatus = asyncHandler(async(req, res, next) => {
    const {companyId, jobId, applicationId} = req.params;
    const {status} = req.body;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,
            isBanned: false,
            $or: [
                {HRs: { $in: [req.user._id]}},
                {createdBy: req.user._id }
            ]
        } 
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const job = await dbService.findOne({
        model: jobModel,
        filter: {
            _id: jobId, companyId, closed: false, frozen: false
        }
    })
    if (!job) {
        return next(new AppError("Job not found", 404))
    }

    const application = await dbService.findOne({
        model: applicationModel,
        filter: {_id: applicationId}
    })

    if (status == statusTypes.accepted) {
        eventEmitter.emit("applicationAccepted", {status, email: application.userEmail})
    } else if (status == statusTypes.rejected) {
        eventEmitter.emit("applicationRejected", {status, email: application.userEmail})
    } else {
        await dbService.updateOne({
            model: applicationModel,
            filter: {_id: applicationId},
            update: {status: status}
        })
    }
    
    return res.status(200).json({msg: "Applications updated successfully"})
})