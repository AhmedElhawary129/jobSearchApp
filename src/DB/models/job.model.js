import mongoose from "mongoose";
import { jobLocationTypes, seniorityLevelTypes, workingTimeTypes } from "../enums.js";


const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    jobLocation: {
        type: String,
        required: true,
        enum: Object.values(jobLocationTypes),
        trim: true
    },
    workingTime: {
        type: String,
        required: true,
        enum: Object.values(workingTimeTypes),
        trim: true
    },
    seniorityLevel: {
        type: String,
        required: true,
        enum: Object.values(seniorityLevelTypes),
        trim: true
    },
    jobDescription: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    technicalSkills: {
        type: [String],
        default: []
    },
    softSkills: {
        type: [String],
        default: []
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    closed: {
        type: Boolean,
        default: false
    },
    frozen: {
        type: Boolean,
        default: false
    },
    frozenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})

export const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema)