const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

exports.type = new GraphQLObjectType({
  name: 'Product',
  fields:() => ({
    name: { type: GraphQLString },
    _id: { type: GraphQLID },
    ingredients: {
      type: new GraphQLList(exports.type),
      resolve: async root => 
        (await root.populate('ingredients').execPopulate()).ingredients
    }
  })
});

const args = {
  _id: {type: GraphQLString},
  name: { type: GraphQLString },
}

exports.queries = {
  product: {
      type: new GraphQLList(exports.type),
      args
  }
};

exports.mutations = {
  product: {
      type: exports.type,
      args: {
        ingredients: { type: new GraphQLList(GraphQLString) },
        ...args
      }
  }
};