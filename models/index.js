const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const merge = require('lodash.merge');
const { GraphQLObjectType, GraphQLSchema } = require('graphql');
mongoose.connect('mongodb://localhost/sushka');
const root = {};

for (const fileName of fs.readdirSync(__dirname)) {
    if (fileName.includes('index')) continue;
    const [{Query, Mutation}, resolver] = [
        require(path.join(__dirname, fileName, 'graph')),
        require(path.join(__dirname, fileName, 'resolver'))
    ];

    merge(root, {Query, Mutation}, resolver);
}
  
module.exports = new GraphQLSchema({ 
    query: new GraphQLObjectType({
        name: 'Query', 
        fields: root.Query
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation', 
        fields: root.Mutation
    }) 
});