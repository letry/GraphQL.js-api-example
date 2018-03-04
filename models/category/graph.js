const {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const { type: productType } = require('../product/graph');
const { getArrayMutationConfig } = require('../../utils');

const args = {
    _id: {type: GraphQLString},
    name: {type: GraphQLString},
    parent: {type: GraphQLString}
};
const getPopulate = fieldName =>
 async category => (await category.populate(fieldName).execPopulate())[fieldName];
//cooming soon es6 modules...
exports.type = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
      _id: {type: new GraphQLNonNull(GraphQLID)},
      name: {type: new GraphQLNonNull(GraphQLString)},
      parent: {
          type: exports.type,
          resolve: getPopulate('parent')
      },
      children: {
          type: new GraphQLList(exports.type),
          resolve: getPopulate('children')
      },
      childProducts: {
          type: new GraphQLList(productType),
          resolve: getPopulate('childProducts')
      }
  })
});

exports.Query = {
    category: {type: new GraphQLList(exports.type), args}
}; 

exports.Mutation = {
    category: {type: exports.type, args},
    categoryArrayModify: getArrayMutationConfig('category', ['childProducts'])
};