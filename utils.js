const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType
  } = require('graphql'); 
const { ObjectId } = require('mongoose').Types;
const getBitmapValue = (...args) => parseInt(args.map(Number).join(''), 2);

module.exports = {
    getArrayMutationConfig: (name, fields) => ({
        type: GraphQLString,
            args: {
                _id: {type: new GraphQLNonNull(GraphQLString)},
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
    }),

    getArrayMutationResolvers: model =>
        async (root, {_id, action, field, value}) => (
            await model.findByIdAndUpdate(_id, {
                [action]: {[field]: +value || value}
            }, {
                runValidators: true,
                upsert: true, new: true
            }), value
        ),

    getStandartMutation: model => (root, {_id, ...body}) => [
        () => [null],
        () => model.create(body),
        () => model.findByIdAndRemove(_id),
        () => model.findByIdAndUpdate(_id, body, {runValidators: true, new: true})
    ]
    [getBitmapValue(ObjectId.isValid(_id), Object.keys(body).length)](),
}