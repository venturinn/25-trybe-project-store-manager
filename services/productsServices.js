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

  module.exports = {
    getAllProducts,
    findProductById,
  };