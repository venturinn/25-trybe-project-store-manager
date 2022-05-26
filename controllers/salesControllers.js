const salesServices = require('../services/salesServices');

const getAllSales = async (_req, res) => {
  const allSales = await salesServices.getAllSales();

  res.status(200).json(allSales);
};

const findSaleById = async (req, res, next) => {
  const { id } = req.params;
  const saleById = await salesServices.findSaleById(id);

  if (saleById.error) return next(saleById.error);

  res.status(200).json(saleById);
};

const addNewSale = async (req, res, next) => {
    const saleData = req.body;
    const newSale = await salesServices.addNewSale(saleData);
  
    if (newSale.error) return next(newSale.error);
  
    res.status(201).json(newSale);
  };

module.exports = {
  getAllSales,
  findSaleById,
  addNewSale,
};
