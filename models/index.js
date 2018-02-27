const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const merge = require('lodash.merge');
const { makeExecutableSchema } = require('graphql-tools');
const { parseGraphToString } = require('../utils');
mongoose.connect('mongodb://localhost/sushka');

const graphs = {};
const resolvers = {};

for (const fileName of fs.readdirSync(__dirname)) {
    if (fileName.includes('index')) continue;
    const [graph, resolver] = [
        require(path.join(__dirname, fileName, 'graph')),
        require(path.join(__dirname, fileName, 'resolver'))
    ];

    merge(graphs, graph);
    merge(resolvers, resolver);
}

const schemaString = parseGraphToString(graphs);

module.exports = makeExecutableSchema({
    typeDefs: [schemaString],
    resolvers
})