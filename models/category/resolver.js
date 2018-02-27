const { model } = require('./model');
const graphqlFields = require('graphql-fields'); 
const { getArrayMutationResolvers, getStandartMutation } = require('../../utils'); 

module.exports = {
    Query: {
        category: {
            resolve: (root, args, ctx, info) => model.find(args, Object.keys(graphqlFields(info)))
        }
    },
    Mutation: {
        category: {
            resolve: getStandartMutation(model)
        },
        categoryArrayModify: {
            resolve: getArrayMutationResolvers(model)
        }
    }
};