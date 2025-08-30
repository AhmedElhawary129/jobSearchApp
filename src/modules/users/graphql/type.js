import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

// Admin dashboard

// attachments
const attachmentsType = new GraphQLObjectType({
    name: "attachments",
    fields: () => ({
        public_id: { type: GraphQLString },
        secure_url: { type: GraphQLString }
    })
});

//---------------------------------------------------------------------------------------------------------------

// viewers
const viewersType = new GraphQLObjectType({
    name: "viewer",
    fields: () => ({
        userId: {type: GraphQLID},
        time: {type: new GraphQLList(GraphQLString)},
        _id: {type: GraphQLID},
    })
})

//---------------------------------------------------------------------------------------------------------------

// users
export const allUsersType = new GraphQLList(new GraphQLObjectType({
    name: "users",
    fields: {
        _id: {type: GraphQLID},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        phone: {type: GraphQLString},
        gender: {type: GraphQLString},
        DOB: {type: GraphQLString},
        role: {type: GraphQLString},
        confirmed: {type: GraphQLBoolean},
        isDeleted: {type: GraphQLBoolean},
        isBanned: {type: GraphQLBoolean},
        deletedBy: {type: GraphQLID},
        bannedBy: {type: GraphQLID},
        updatedBy: {type: GraphQLID},
        roleUpdatedBy: {type: GraphQLID},
        deletedAt: {type: GraphQLString},
        bannedAt: {type: GraphQLString},
        profileImage: {type: attachmentsType},
        coverImage: {type: attachmentsType},
        viewers: {type: new GraphQLList(viewersType)},
        friends: {type: new GraphQLList(GraphQLID)},
        blockedUsers: {type: new GraphQLList(GraphQLID)}
    }
}))

//---------------------------------------------------------------------------------------------------------------

// companies
export const allCompaniesType = new GraphQLList(new GraphQLObjectType({
    name: "companies",
    fields: {
        _id: {type: GraphQLID},
        companyName: {type: GraphQLString},
        description: {type: GraphQLString},
        industry: {type: GraphQLString},
        address: {type: GraphQLString},
        companyEmail: {type: GraphQLString},
        numberOfEmployees: {type: GraphQLInt},
        logo: {type: attachmentsType},
        coverImage: {type: attachmentsType},
        legalAttachment: {type: attachmentsType},
        isDeleted: {type: GraphQLBoolean},
        isBanned: {type: GraphQLBoolean},
        approvedByAdmin: {type: GraphQLBoolean},
        createdBy: {type: GraphQLID},
        deletedBy: {type: GraphQLID},
        bannedBy: {type: GraphQLID},
        HRs: {type: new GraphQLList(GraphQLID)},
        deletedAt: {type: GraphQLString},
        bannedAt: {type: GraphQLString}
    }
}))

//---------------------------------------------------------------------------------------------------------------

// jobs
export const allJobsType = new GraphQLList(new GraphQLObjectType({
    name: "jobs",
    fields: {
        _id: {type: GraphQLID},
        jobTitle: {type: GraphQLString},
        jobLocation: {type: GraphQLString},
        workingTime: {type: GraphQLString},
        seniorityLevel: {type: GraphQLString},
        jobDescription: {type: GraphQLString},
        technicalSkills: {type: new GraphQLList(GraphQLString)},
        softSkills: {type: new GraphQLList(GraphQLString)},
        companyId: {type: GraphQLID},
        isDeleted: {type: GraphQLBoolean},
        isBanned: {type: GraphQLBoolean},
        approvedByAdmin: {type: GraphQLBoolean},
        addedBy: {type: GraphQLID},
        updatedBy: {type: GraphQLID},
        frozenBy: {type: GraphQLID},
        closed: {type: GraphQLBoolean},
        frozen: {type: GraphQLBoolean}
    }
}))