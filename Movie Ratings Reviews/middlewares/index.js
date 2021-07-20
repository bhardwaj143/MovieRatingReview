const joi = require('joi');

const saveValidation = (req, res, next) => {
  const ratings = joi.object({
    email: joi.string()
      .required(),
      password: joi.number()
      .required(),
      name: joi.string()
      .optional(),
     });
  const { error } = ratings.validate(req.body);
  if (error) {
    return res.send(error.message);
  }
  next();
};

module.exports = { saveValidation };


