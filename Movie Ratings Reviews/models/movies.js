const { object, string, number } = require('joi');
const mongoose = require('mongoose');


const schema = mongoose.Schema({
    movieName: {
      type: String,
    },
    discription: {
      type: String,
      
    },
 });
  
  module.exports = mongoose.model('movies', schema);