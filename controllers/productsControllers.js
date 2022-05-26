const productsServices = require('../services/productsServices');

const getAllProducts = async (_req, res) => {
  const allProducts = await productsServices.getAllProducts();

  res.status(200).json(allProducts);
};

const findProductById = async (req, res, next) => {
  const { id } = req.params;
  const productById = await productsServices.findProductById(id);

  if (productById.error) return next(productById.error);

  res.status(200).json(productById);
};

module.exports = {
  getAllProducts,
  findProductById,
};
