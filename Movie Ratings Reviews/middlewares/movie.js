const joi = require('joi');

const movieValidation = (req, res, next) => {
  const ratings = joi.object({
    movieName: joi.string()
      .required(),
      discription: joi.string()
      .required(),
     });
  const { error } = ratings.validate(req.body);
  if (error) {
    return res.send(error.message);
  }
  next();
};

module.exports = { movieValidation };


