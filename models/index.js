const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { GraphQLObjectType, GraphQLSchema } = require('graphql');
mongoose.connect('mongodb://localhost/sushka');
const queryFields = {};
const mutationFields = {};

for (const fileName of fs.readdirSync(__dirname)) {
    if (fileName.includes('index')) continue;
    const {queries, mutations} = require(path.join(__dirname, fileName));

    Object.assign(mutationFields, mutations);
    Object.assign(queryFields, queries);
}
  
module.exports = new GraphQLSchema({ 
    query: new GraphQLObjectType({
        name: 'Query', 
        fields: queryFields
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation', 
        fields: mutationFields
    }) 
});