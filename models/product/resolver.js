const { model } = require('./model');
const graphqlFields = require('graphql-fields'); 
const { getArrayMutationResolvers, getStandartMutation } = require('../../utils'); 

module.exports = {
    Query: {
        product: {
            resolve: (root, args, ctx, info) => model.find(args, Object.keys(graphqlFields(info)))
        }
    },
    Mutation: {
        product: {
            resolve: getStandartMutation(model)
        },
        productArrayModify: {
            resolve: getArrayMutationResolvers(model)
        }
    }
};