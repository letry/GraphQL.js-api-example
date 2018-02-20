const merge = require('lodash/merge');
const { queries, mutations } = require('./graph');
const { model } = require('./model');
const { ObjectId } = require('mongoose').Types;
const graphqlFields = require('graphql-fields'); 

const mapResolvers = {
    queries: {
        product: {
            resolve: (root, args, ctx, info) => model.find(args, Object.keys(graphqlFields(info)))
        }
    },
    mutations: {
        product: {
            resolve: (root, {_id, ...body}) => {
                const options = {runValidators: true, new: true};
                const haveBody = Object.keys(body).length;
                const haveId = ObjectId.isValid(_id);
 
                return !haveId && haveBody ? model.create(body)
                :haveId && haveBody ? model.findByIdAndUpdate(_id, body, options)
                :!haveId ? [null] : model.findByIdAndRemove(_id);
            }
        }
    }
};
module.exports = merge(mapResolvers, {queries, mutations});