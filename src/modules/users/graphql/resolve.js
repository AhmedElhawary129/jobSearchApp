import * as dbService from "../../../DB/dbService.js";
import { roleTypes } from "../../../DB/enums.js";
import { companyModel, jobModel, userModel } from "../../../DB/models/index.js";
import { authGraphQL } from "../../../middleware/auth.js";
import { validationGraphQL } from "../../../middleware/validation.js";
import { graphQLSchema } from "../user.validation.js";


// Admin dashboard

// get all users
export const getUsers = async (parent, args) => {
        const {authorization} = args;

    // validation
    await validationGraphQL({schema: graphQLSchema, data: args})

    // authentication
    await authGraphQL({authorization, accessRoles: [roleTypes.admin, roleTypes.superAdmin]})

    const users = await dbService.find({model: userModel})
    return users
}

//---------------------------------------------------------------------------------------------------------------

// get all companies
export const getCompanies = async (parent, args) => {
    const {authorization} = args;

    // validation
    await validationGraphQL({schema: graphQLSchema, data: args})

    // authentication
    await authGraphQL({authorization, accessRoles: [roleTypes.admin, roleTypes.superAdmin]})

    const companies = await dbService.find({model: companyModel})
    return companies
}

//---------------------------------------------------------------------------------------------------------------

// get all jobs
export const getJobs = async (parent, args) => {
    const {authorization} = args;

    // validation
    await validationGraphQL({schema: graphQLSchema, data: args})

    // authentication
    await authGraphQL({authorization, accessRoles: [roleTypes.admin, roleTypes.superAdmin]})

    const jobs = await dbService.find({model: jobModel})
    return jobs
}