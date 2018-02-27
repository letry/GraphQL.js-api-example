const merge = require('lodash/merge');
const { model } = require('./model');
const graphqlFields = require('graphql-fields'); 
const { getArrayMutationResolvers, getStandartMutation } = require('../../utils');

const getPopulate = fieldName =>
 async category => (await category.populate(fieldName).execPopulate())[fieldName];

module.exports = merge({
    Query: {
        category: (root, args, ctx, info) => 
            model.find(args, Object.keys(graphqlFields(info)))
    },
    Mutation: {
        category: getStandartMutation(model)
    },
    Category: ['parent', 'children', 'childProducts'].reduce((result, field) => 
            Object.assign(result, {[field]: getPopulate(field)}), {}),
            
}, getArrayMutationResolvers('category', model));