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

const addNewProduct = async (req, res, next) => {
    const { name, quantity } = req.body;
      
    const newProduct = await productsServices.addNewProduct(name, quantity);

    if (newProduct.error) return next(newProduct.error);

    res.status(201).json(newProduct);
  };

  const updateProduct = async (req, res, next) => {
    const { name, quantity } = req.body;
    const { id } = req.params;
    const updatedProduct = await productsServices.updateProduct(id, name, quantity);

    if (updatedProduct.error) return next(updatedProduct.error);

    res.status(200).json(updatedProduct);
  };

  const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await productsServices.deleteProduct(id);

    if (deletedProduct.error) return next(deletedProduct.error);

    res.status(204).json();
  };

module.exports = {
  getAllProducts,
  findProductById,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
