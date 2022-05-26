const salesModels = require('../models/salesModels');
const salesProductsModels = require('../models/salesProductsModel');

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

const addNewSale = async (saleData) => {
  const newSaleId = await salesModels.addNewSale();

  await Promise.all(
    saleData.map((product) =>
      salesProductsModels.addNewSale(
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
        salesProductsModels.addNewSale(
          id,
          product.productId,
          product.quantity,
        )),
    );
  
    return { saleId: id, itemUpdated: saleData };
  };

module.exports = {
  getAllSales,
  findSaleById,
  addNewSale,
  updateSale,
};
