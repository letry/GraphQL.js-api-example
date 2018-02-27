const isPlainObject = require('lodash/isPlainObject');
const { ObjectId } = require('mongoose').Types;

const getBitmapValue = (...args) => parseInt(args.map(Number).join(''), 2);

module.exports = {
    getArrayMutationType: (name, fields) => ({
        enum_: {
            [`${name}ArrayFields`]: fields,
            [`${name}ArrayActionEnum`]: ['push', 'pull', 'addToSet']
        },
        type_: {
            Mutation: {
                [`${name}ArrayModify(
                    _id: String!
                    field: ${name}ArrayFields!
                    action: ${name}ArrayActionEnum!
                    value: String!
                )`] : 'String'
            }
        }
    }),

    getArrayMutationResolvers: (name, model) => ({
        Mutation: {
            [`${name}ArrayModify`]: async (root, {_id, action, field, value}) => (
                await model.findByIdAndUpdate(_id, {
                    [action]: {[field]: +value || value}
                }, {
                    runValidators: true,
                    upsert: true, new: true
                }), value
            )
        },
        [`${name}ArrayActionEnum`]: {
            addToSet: '$addToSet',
            pull: '$pull',
            push: '$push'
        }
    }),

    getStandartMutation: model => (root, {_id, ...body}) => [
        () => [null],
        () => model.create(body),
        () => model.findByIdAndRemove(_id),
        () => model.findByIdAndUpdate(_id, body, {runValidators: true, new: true})
    ]
    [getBitmapValue(ObjectId.isValid(_id),Object.keys(body).length)](),

    parseGraphToString: function parseTree(tree) {
        let result = '';
        const parseValue = value => 
            isPlainObject(value) ? parseTree(value) : value.toString();

        const parseKeyVal = (key, value) => 
            ` ${key} ${typeof value === 'string' ? `: ${value}` : `{${parseValue(value)}}`} `;

        for (let key in tree) {
            const value = tree[key];
            const isWrapper = key[key.length-1] === '_';
            const parsedKey = isWrapper ? key.slice(0, -1) : key;

            if (isWrapper)
                result += ` ${Object.keys(value).map(key => 
                    ` ${parsedKey} ${parseKeyVal(key, value[key])} `
                ).join(' ')} `;
            else
                result += parseKeyVal(parsedKey, value)
        }
        return result;
    }
}