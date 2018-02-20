const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

exports.schema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    ingredients: [{
      type: ObjectId,
      ref: 'product'
    }]
});
  
exports.model = mongoose.model('product', exports.schema);