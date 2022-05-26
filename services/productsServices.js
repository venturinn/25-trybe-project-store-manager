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

  const updateProduct = async (id, name, quantity) => {
    const existingProductId = await productsModels.findProductById(id);
    if (!existingProductId) {
        return {
          error: {
            code: 'notFound',
            message: 'Product not found',
          }, 
        }; 
    }
    await productsModels.updateProduct(id, name, quantity);

    return ({ id, name, quantity });
  };

  const deleteProduct = async (id) => {
    const existingProductId = await productsModels.findProductById(id);
    if (!existingProductId) {
        return {
          error: {
            code: 'notFound',
            message: 'Product not found',
          }, 
        }; 
    }

    await productsModels.deleteProduct(id);
    return ({ deleted: id });
  };

  module.exports = {
    getAllProducts,
    findProductById,
    addNewProduct,
    updateProduct,
    deleteProduct,
  };