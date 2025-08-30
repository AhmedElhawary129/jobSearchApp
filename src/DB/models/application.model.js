import mongoose from "mongoose";
import { statusTypes } from "../enums.js";

const applicationSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Job"
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Company"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    userCV: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: Object.values(statusTypes),
        default: statusTypes.pending
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})

// Prevent the same user from applying to the same job twice
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const applicationModel = mongoose.models.Application || mongoose.model("Application", applicationSchema)