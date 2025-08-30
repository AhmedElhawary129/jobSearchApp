import joi from "joi";
import { Types } from "mongoose";

export const customId = (value, helper) => {
    let data = Types.ObjectId.isValid(value);
    return data ? value : helper.message("Invalid ID");
}

//---------------------------------------------------------------------------------------------------------------

export const customAge = (value, helpers) => {
    const today = new Date();
    const birthDate = new Date(value);
    if (birthDate > today) {
        return helpers.error("any.custom", "Date of birth cannot be in the future");
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    if (age < 18) {
        return helpers.error("any.custom", "Age must be at least 18 years old");
    }
    return value;
};

//---------------------------------------------------------------------------------------------------------------

// general rules
export const generalRules = {
    objectId: joi.string().custom(customId),
    email: joi.string().email({tlds: {allow: ["com", "net", "outlook"]}, minDomainSegments: 2, maxDomainSegments: 3}),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    DOB: joi.date().custom(customAge).messages({
    "date.base": "Date of birth must be a valid date"
}),
    headers: joi.object({
        authorization: joi.string().required(),
        "cache-control": joi.string(),
        "postman-token": joi.string(),
        "content-type": joi.string(),
        "content-length": joi.string(),
        host: joi.string(),
        "user-agent": joi.string(),
        accept: joi.string(),
        "accept-encoding": joi.string(),
        connection: joi.string()
    }),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().valid("profileImage", "coverImage", "logo", "legalAttachment", "userCV").required()
    }).messages({"any.required": "File is required"})
}