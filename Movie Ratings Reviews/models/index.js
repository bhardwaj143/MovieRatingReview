const { object, string, number } = require('joi');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
  }
});

module.exports = mongoose.model('user', schema);
