const merge = require('lodash/merge');
const { getArrayMutationType } = require('../../sharedTypes');

const args = '_id: String, name: String';

module.exports = merge({
    type_: {
        Query: {
            [`product(${args})`]: `[Product]`
        },
        Mutation: {
            [`product(${args})`]: `Product`
        },
        Product: {
            _id: 'ID',
            name: 'String!',
            ingredients: '[Product]'
        }
    }
}, getArrayMutationType('product', ['ingredients']));