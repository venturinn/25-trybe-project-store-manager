const productsModels = require('../models/productsModels');

const getAllProducts = async () => {
    const allProducts = await productsModels.getAllProducts();
  
    return allProducts;
  };

  const findProductById = async (id) => {
    const productById = await productsModels.findProductById(id);

    if (!productById) {
        return {
          error: {
            code: 'notFound',
            message: 'Product not found',
          },
        };
      }
  
    return productById;
  };

  const addNewProduct = async (name, quantity) => {
    const existingProductName = await productsModels.findProductByName(name);

    if (existingProductName) {
        return {
          error: {
            code: 'alreadyExists',
            message: 'Product already exists',
          },
        };
      }
  
    const newProductId = await productsModels.addNewProduct(name, quantity);

    return ({ id: newProductId, name, quantity });
  };

  module.exports = {
    getAllProducts,
    findProductById,
    addNewProduct,
  };