const salesModels = require('../models/salesModels');

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

  module.exports = {
    getAllSales,
    findSaleById,
  };