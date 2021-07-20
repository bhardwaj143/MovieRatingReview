const { object, string, number } = require('joi');
const mongoose = require('mongoose');


const schema = mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      
    },
    comment: {
      type: String
    },
    movieName: {
      type: String
    },
    movie: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "movies"
      }
      ]
  });
  
  module.exports = mongoose.model('ratings', schema);