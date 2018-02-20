const {
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const {type: productType} = require('../product/graph');
const { getArrayMutationConfig } = require('../../sharedTypes');


const getPopulate = fieldName =>
 async category => (await category.populate(fieldName).execPopulate())[fieldName];
 
exports.type = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
      _id: {type: GraphQLID},
      name: {type: new GraphQLNonNull(GraphQLString)},
      parent: {
          type: new GraphQLList(exports.type),
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

const args = {
    _id: {type: GraphQLString},
    name: {type: GraphQLString},
    parent: {type: GraphQLString}
};

exports.queries = {
    category: {type: new GraphQLList(exports.type), args}
}; 

exports.mutations = {
    category: {type: exports.type, args},
    categoryArrayModify: getArrayMutationConfig('category', ['childProducts'])
};