const movies = require('../models/movies')


/* Save Movie */
const saveMovie = async (payload = {}) =>
  new Promise((resolve, reject) => {
    const newMovie = new movies(payload);
    newMovie.save()
      .then(resolve)
      .catch(reject);
  });


 /* Get All Movie */ 
 const getAllMovie = async (select, project) => movies.find(select, project)
  .lean()
  .exec();  

module.exports = { saveMovie , getAllMovie };