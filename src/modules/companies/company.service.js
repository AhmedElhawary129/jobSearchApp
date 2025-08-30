import * as dbService from "../../DB/dbService.js";
import { roleTypes } from "../../DB/enums.js";
import { companyModel } from "../../DB/models/index.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/index.js";

//---------------------------------------------------------------------------------------------------------------

// add company
export const addCompany = asyncHandler(async(req, res, next) => {

    if (await dbService.findOne({model: companyModel, filter: {companyName: req.body.companyName}})) {
        return next(new AppError("Company name already exists, please change it", 400))
    }

    if (await dbService.findOne({model: companyModel, filter: {companyEmail: req.body.companyEmail}})) {
        return next(new AppError("Company email already exists", 400))
    }

if (!req.file) {
        return next(new AppError("legal attachment is required", 400))
    }
    const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {
        folder: `jobSearchApp/companies/${req.user._id}/legalAttachment`
    })
    req.body.legalAttachment = {public_id, secure_url}

    const company = await dbService.create({
        model: companyModel, 
        query: {...req.body, createdBy: req.user._id, HRs: req.user._id}
    })
    return res.status(201).json({msg: "Company added successfully", company})
})

//-----------------------------------------------------------------------------------------------------------------

// update company
export const updateCompany = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    const updatedCompany = await dbService.findOneAndUpdate({
        model: companyModel,
        filter: {_id: companyId},
        update: req.body,
        
    })
    return res.status(201).json({msg: "Company updated successfully", company: updatedCompany})
})

//-----------------------------------------------------------------------------------------------------------------

// freeze company (Soft delete)
export const freezeCompany = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;
    const condition = req.user.role === roleTypes.admin ? {} : {createdBy: req.user._id}
    
    const company = await dbService.findByIdAndUpdate({
        model: companyModel, 
        filter: {_id: companyId, ...condition, isDeleted: false}, 
        update: {isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now()}, 
        options: {new: true}
    })
    if (!company) {
        return next(new AppError("company not found or already frozen or unauthorized", 404))
    }
    return res.status(201).json({msg: "company frozen successfully"})
})

//-----------------------------------------------------------------------------------------------------------------

// unfreeze company
export const unFreezeCompany = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOneAndUpdate({
        model: companyModel, 
        filter: {_id: companyId, isDeleted: true, deletedBy: req.user._id}, 
        update: {isDeleted: false, $unset: {deletedBy: 0, deletedAt: 0}}, 
        options: {new: true}
    })
    if (!company) {
        return next(new AppError("Company not found or already unFrozen or unauthorized", 404))
    }
    return res.status(201).json({msg: "Company unFrozen successfully"})
})

//-----------------------------------------------------------------------------------------------------------------

// Get specific company with related jobs
export const getCompanyWithJobs = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const condition = req.user.role === roleTypes.admin ? {} : { createdBy: req.user._id };

    let company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false,
            $or: [
                {HRs: { $in: [req.user._id] }},
                {...condition}
            ]
        },
        populate: [{path: "jobs"}]
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    if (company.createdBy.toString()== req.user._id) {
        company = await dbService.findOne({
            model: companyModel,
            filter: {
                _id: companyId, 
                isDeleted: false
            },
            populate: [{path: "jobs"}]
        })
        return res.status(201).json({msg: "Your company", company})
    }
    company = await dbService.findOne({
        model: companyModel,
        filter: {
            _id: companyId, 
            isDeleted: false
        },
        populate: [{path: "jobs"}]
    })
    return res.status(201).json({msg: `The ${company.companyName} company :`, company})
})

//-----------------------------------------------------------------------------------------------------------------

// Search for a company with a name
export const searchByName = asyncHandler(async(req, res, next) => {
    const {companyName} = req.body;

    let company = await dbService.findOne({
        model: companyModel,
        filter: {companyName, isDeleted: false}
    })
    if (!company) {
        return next(new AppError("Company not found or deleted", 404))
    }

    if (req.user._id.toString() === company.createdBy.toString()) {
        return res.status(200).json({msg: "Your company :", company})
    }

    const companyToView = await dbService.findOne({
        model: companyModel,
        filter: {companyName, isDeleted: false},
        select: "companyName description industry companyEmail address  -_id"
    })
    return res.status(200).json({msg: `The ${company.companyName} company found successfully`, company: companyToView})
})

//---------------------------------------------------------------------------------------------------------------

// upload or update logo
export const uploadLogo = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }
    if (!req.file) {
        return next(new AppError("Please upload the logo", 400))
    }
    if (company?.logo?.public_id) {
        await cloudinary.uploader.destroy(company?.logo?.public_id)
    }
    const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {
        folder: `jobSearchApp/companies/${req.user._id}/logo`
    })
    await dbService.updateOne({
        model: companyModel, 
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}, 
        update: {logo: {public_id, secure_url}}
    })
    return res.status(201).json({msg: "Logo uploaded successfully"})
})

//---------------------------------------------------------------------------------------------------------------

// upload or update cover image
export const uploadCoverImage = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    if (!req.file) {
        return next(new AppError("Please upload an image", 400))
    }
    if (company?.coverImage?.public_id) {
        await cloudinary.uploader.destroy(company.coverImage.public_id)
    }
    const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {
        folder: `jobSearchApp/companies/${req.user._id}/coverImage`
    })
    await dbService.updateOne({
        model: companyModel, 
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}, 
        update: {coverImage: {public_id, secure_url}}
    })
    return res.status(201).json({msg: "Cover image uploaded successfully"})
})

//---------------------------------------------------------------------------------------------------------------

// delete logo
export const deleteLogo = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    if (!company?.logo?.public_id) {
        return next(new AppError("Logo already deleted", 409))
    }
    await cloudinary.uploader.destroy(company.logo.public_id)
    await dbService.updateOne({
        model: companyModel, 
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}, 
        update: {$unset: {logo: 0}}
    })
    return res.status(201).json({msg: "Logo deleted successfully"})
})

//---------------------------------------------------------------------------------------------------------------

// delete cover image
export const deleteCoverImage = asyncHandler(async(req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}
    })
    if (!company) {
        return next(new AppError("Company not found or deleted or unauthorized", 404))
    }

    if (!company?.coverImage?.public_id) {
        return next(new AppError("Cover image already deleted", 409))
    }
    await cloudinary.uploader.destroy(company.coverImage.public_id)
    await dbService.updateOne({
        model: companyModel, 
        filter: {_id: companyId, createdBy: req.user._id, isDeleted: false}, 
        update: {$unset: {coverImage: 0}}
    })
    return res.status(201).json({msg: "Cover image deleted successfully"})
})