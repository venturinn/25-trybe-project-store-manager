const salesModels = require('../models/salesModels');
const salesProductsModels = require('../models/salesProductsModel');
const productsServices = require('./productsServices');

const getAllSales = async () => {
  const allSales = await salesModels.getAllSales();

  return allSales;
};

const findSaleById = async (id) => {
  const saleById = await salesModels.findSaleById(id);

  if (!saleById) {
    return {
      error: {
        code: 'notFound',
        message: 'Sale not found',
      },
    };
  }

  return saleById;
};

const updateProductQuantity = (saleData) => {
  saleData.forEach(async (product) => {
    const { productId, quantity } = product;
    const productStore = await productsServices.findProductById(productId);
    const newQuantity = productStore.quantity - quantity;
    productsServices.updateProductQuantity(productId, newQuantity);
  });
};

const verifyProductQuantity = async (saleData) => {
  const verifyQuantity = await Promise.all(
    saleData.map(async (productSold) => {
      const productStore = await productsServices.findProductById(
        productSold.productId,
      );
      return productStore.quantity >= productSold.quantity;
    }),
  );
  const insufficientQuantity = verifyQuantity.some(
    (element) => element === false,
  );
  return !insufficientQuantity;
};

const addNewSale = async (saleData) => {
  const verifyQuantity = await verifyProductQuantity(saleData);
  if (verifyQuantity === true) {
    updateProductQuantity(saleData);
  } else {
    return { error: { code: 'UnprocessableEntity',
        message: 'Such amount is not permitted to sell',
      },
    };
  }

  const newSaleId = await salesModels.addNewSale();

  await Promise.all(
    saleData.map((product) => salesProductsModels.addNewSale(
        newSaleId,
        product.productId,
        product.quantity,
      )),
  );

  return { id: newSaleId, itemsSold: saleData };
};

const updateSale = async (id, saleData) => {
  const existingSaleId = await salesModels.findSaleById(id);
  if (!existingSaleId) {
    return { error: { code: 'notFound', message: 'Sale not found' } };
  }

  await salesProductsModels.deleteSale(id);

  await Promise.all(
    saleData.map((product) =>
      salesProductsModels.addNewSale(id, product.productId, product.quantity)),
  );

  return { saleId: id, itemUpdated: saleData };
};

const deleteSale = async (id) => {
  const existingSaleId = await salesModels.findSaleById(id);
  if (!existingSaleId) {
    return {
      error: {
        code: 'notFound',
        message: 'Sale not found',
      },
    };
  }

  await salesProductsModels.deleteSale(id);
  await salesModels.deleteSale(id);
  return { deleted: id };
};

module.exports = {
  getAllSales,
  findSaleById,
  addNewSale,
  updateSale,
  deleteSale,
};
