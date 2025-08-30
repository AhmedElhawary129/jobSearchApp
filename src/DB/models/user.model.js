import mongoose from "mongoose";
import { genderTypes, providerTypes, roleTypes } from "../enums.js";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 8,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: Object.values(genderTypes),
        default: genderTypes.other
    },
    DOB: {
        type: Date
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    bannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bannedAt: Date,
    role: {
        type: String,
        enum: Object.values(roleTypes),
        default: roleTypes.user
    },
    profileImage: {
        secure_url: String,
        public_id: String
    },
    coverImage: {
        secure_url: String,
        public_id: String
    },
    otpEmail: String,
    otpPassword: String,
    otpOldEmail: String,
    otpNewEmail: String,
    otpExpiresAt: Date,
    tempEmail: String,
    passwordChangedAt: Date,
    emailChangedAt: Date,
    provider: {
        type: String,
        enum: Object.values(providerTypes),
        default: providerTypes.system
    },
    viewers: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        time: [Date]
    }],
    friends:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    roleUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})

userSchema.virtual("username").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("age").get(function () {
    if (!this.DOB) return null;

    const today = new Date();
    const birthDate = new Date(this.DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }
    return age;
});

export const userModel = mongoose.models.User || mongoose.model("User", userSchema)
export const connectionUser = new Map()