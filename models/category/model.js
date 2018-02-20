const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

exports.schema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  parent: {
      type: ObjectId,
      ref: 'category'
  },
  childProducts: [{
    type: ObjectId,
    ref: 'product'
  }]
});

exports.schema.virtual('children', {
  ref: 'category',
  localField: '_id',
  foreignField: 'parent'
});
  
exports.model = mongoose.model('category', exports.schema);