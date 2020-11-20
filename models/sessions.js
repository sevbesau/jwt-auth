const { Schema, model } = require('mongoose');

const newSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

const Sessions = model('sessions', newSchema);
module.exports = Sessions;
