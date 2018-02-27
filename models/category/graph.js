const merge = require('lodash/merge');
const { getArrayMutationType } = require('../../utils');

const args = '_id: String, name: String, parent: String';

module.exports = merge({
    type_: {
        Query: {
            [`category(${args})`]: `[Category]`
        },
        Mutation: {
            [`category(${args})`]: `Category`
        },
        Category: {
            _id: 'ID',
            name: 'String!',
            parent: 'Category',
            children: '[Category]',
            childProducts: '[Product]'
        }
    }
}, getArrayMutationType('category', ['childProducts']));