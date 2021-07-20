const ratings = require('../models/rating')


/* Save Rating And Comments */
const saveRatingComment = async (payload = {}) =>
  new Promise((resolve, reject) => {
    const newRating = new ratings(payload);
    newRating.save()
      .then(resolve)
      .catch(reject);
  });


/* Check Email Already Exist Or Not */  
const checkEmailExists = async (data) => ratings.findOne(data)
  .sort()
  .lean()
  .exec(); 


/*Get All The Ratings And Comments*/  
const listratingsComments = async (search = {}, skip, limit) => new Promise((resolve, reject) => {
    ratings.find(search)
      .sort('-rating')
      .skip(skip).limit(limit)
      .then(resolve)
      .catch(reject)
  })  


/* Calculate Avrage Rating */

const calAvrgRating =  (search = {}) => new Promise((resolve, reject) => {
  
  ratings.aggregate(
    [
      {
        $group:
          {
            _id: "$email",
            avgRating: { $avg: "$rating" },
            count:{$sum:1},
          }
      }
    ]
 )
    .then(resolve)
    .catch(reject)
})  


 /* Total Avrg */ 
 const getAllRatings = async (select, project) => ratings.find(select, project)
  .lean()
  .exec();


/*Get Record Count*/  
const getRatingCount =  (search) => new Promise((resolve, reject) => {
  ratings.count(search)
    .then(resolve)
    .catch(reject)
})  

module.exports = {  checkEmailExists , saveRatingComment, listratingsComments , calAvrgRating, getAllRatings , getRatingCount };