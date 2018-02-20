const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType
  } = require('graphql'); 

module.exports = {
    getArrayMutationConfig: (name, fields) => ({
        type: GraphQLString,
            args: {
                _id: {type: GraphQLString},
                field: {
                    type: new GraphQLNonNull(new GraphQLEnumType({
                        name: `${name}ArrayFields`,
                        values: fields.reduce((result, field) => 
                            Object.assign(result, {[field]: {value: field}}), {})
                    }))
                },
                action: {
                    type: new GraphQLNonNull(new GraphQLEnumType({
                        name: `${name}ArrayActionEnum`,
                        values: {
                            push:  {value: '$push'},
                            pull:  {value: '$pull'},
                            addToSet: {value: '$addToSet'}
                        }
                    }))
                },
                value: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            }
    })
}