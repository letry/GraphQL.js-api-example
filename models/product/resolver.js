const merge = require('lodash/merge');
const { model } = require('./model');
const graphqlFields = require('graphql-fields'); 
const { getArrayMutationResolvers, getStandartMutation } = require('../../sharedTypes');

const getPopulate = fieldName =>
 async product => (await product.populate(fieldName).execPopulate())[fieldName];

module.exports = merge({
    Query: {
        product: (root, args, ctx, info) => 
            model.find(args, Object.keys(graphqlFields(info)))
    },
    Mutation: {
        product: getStandartMutation(model)
    },
    Product: {
        ingredients: async product => 
            (await product.populate('ingredients').execPopulate()).ingredients
    }
}, getArrayMutationResolvers('product', model));