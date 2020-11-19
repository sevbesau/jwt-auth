const { Schema, model } = require('mongoose');

const newSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = model('users', newSchema);
module.exports = Users;
