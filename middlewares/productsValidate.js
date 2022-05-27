const Joi = require('joi');

module.exports = (req, _res, next) => {
  const { name, quantity } = req.body;
  const { error } = Joi.object({
    name: Joi.string().min(5).required(),
    quantity: Joi.number().min(1).required(),
  }).validate({ name, quantity });

  if (error) {
    return next(error);
  }
  
  next();
};
