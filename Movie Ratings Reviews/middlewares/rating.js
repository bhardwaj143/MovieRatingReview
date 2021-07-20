const joi = require('joi');

const ratingValidation = (req, res, next) => {
  const ratings = joi.object({
    movieName: joi.string()
      .required(),
      email: joi.string()
      .required(),
      rating: joi.number()
      .required(),
      comment: joi.string()
      .required(),
      movie: joi.string()
      .required(),
     });
  const { error } = ratings.validate(req.body);
  if (error) {
    return res.send(error.message);
  }
  next();
};

module.exports = { ratingValidation };