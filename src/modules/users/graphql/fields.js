import { GraphQLNonNull, GraphQLString } from "graphql";
import * as UR from "./resolve.js";
import * as UT from "./type.js";

// Admin dashboard
export const adminQuery = {
    getUsers: {
        type: UT.allUsersType,
        args: {
            authorization: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: UR.getUsers
    },
    getCompanise: {
        type: UT.allCompaniesType,
        args: {
            authorization: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: UR.getCompanies
    },
    getJops: {
        type: UT.allJobsType,
        args: {
            authorization: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: UR.getJobs
    }
}