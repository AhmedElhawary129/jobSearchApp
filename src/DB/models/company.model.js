import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    address: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    numberOfEmployees: {
        type: Number,
        required: true,
        min: 20,
        max: 500
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    logo: {
        secure_url: String,
        public_id: String
    },
    coverImage: {
        secure_url: String,
        public_id: String
    },
    HRs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    deletedAt: Date,
    isBanned: {
        type: Boolean,
        default: false
    },
    bannedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    bannedAt: Date,
    legalAttachment: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})

// virtual populate
companySchema.virtual("jobs", {
    ref: "Job",         
    localField: "_id",
    foreignField: "companyId"
});

export const companyModel = mongoose.models.Company || mongoose.model("Company", companySchema)