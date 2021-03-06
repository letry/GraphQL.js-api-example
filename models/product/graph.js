const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql');
const { getArrayMutationConfig } = require('../../utils');

const args = {
  _id: {type: GraphQLString},
  name: { type: GraphQLString },
}
//cooming soon es6 modules...
exports.type = new GraphQLObjectType({
  name: 'Product',
  fields:() => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    _id: { type: new GraphQLNonNull(GraphQLID) },
    ingredients: {
      type: new GraphQLList(exports.type),
      resolve: async root => 
        (await root.populate('ingredients').execPopulate()).ingredients
    }
  })
});

exports.Query = {
  product: {
      type: new GraphQLList(exports.type),
      args
  }
};

exports.Mutation = {
  product: {
      type: exports.type,
      args: {
        ingredients: { type: new GraphQLList(GraphQLString) },
        ...args
      }
  },
  productArrayModify: getArrayMutationConfig('product', ['ingredients'])
};