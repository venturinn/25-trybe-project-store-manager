const Joi = require('joi');

module.exports = (req, _res, next) => {
  const saleData = req.body;
  saleData.forEach((product) => {
    const { quantity, productId } = product;
    const { error } = Joi.object({
      quantity: Joi.number().min(1).required(),
      productId: Joi.required(),
    }).validate({ quantity, productId });

    if (error) {
      return next(error);
    }
  });
  
  next();
};
