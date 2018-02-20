const merge = require('lodash/merge');
const { queries, mutations } = require('./graph');
const { model } = require('./model');
const { ObjectId } = require('mongoose').Types;
const graphqlFields = require('graphql-fields'); 

const mapResolvers = {
    queries: {
        category: {
            resolve: (root, args, ctx, info) => model.find(args, Object.keys(graphqlFields(info)))
        }
    },
    mutations: {
        category: {
            resolve: (root, {_id, ...body}) => {
                const options = {runValidators: true, new: true};
                const haveBody = Object.keys(body).length;
                const haveId = ObjectId.isValid(_id);
 
                return !haveId && haveBody ? model.create(body)
                :haveId && haveBody ? model.findByIdAndUpdate(_id, body, options)
                :!haveId ? [null] : model.findByIdAndRemove(_id);
            }
        },
        categoryArrayModify: {
            resolve: async (root, {_id, action, field, value}) => (
                await model.findOneAndUpdate(_id, {
                    [action]: {[field]: +value || value}
                }, {
                    runValidators: true,
                    upsert: true, new: true
                }), value
            )
        }
    }
};

module.exports = merge({queries, mutations}, mapResolvers);