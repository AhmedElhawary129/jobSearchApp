import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminQuery } from "./users/graphql/fields.js";

export const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: "Query", // required
            fields: { // required
                ...adminQuery
            }
        })
    });