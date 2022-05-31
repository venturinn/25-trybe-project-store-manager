const salesServices = require('../services/salesServices');

const getAllSales = async (_req, res) => {
  const allSales = await salesServices.getAllSales();

  res.status(200).json(allSales);
};

const findSaleById = async (req, res, next) => {
  const { id } = req.params;
  const saleById = await salesServices.findSaleById(id);

  if (saleById.error) return next(saleById.error, null, res);

  res.status(200).json(saleById);
};

const addNewSale = async (req, res, next) => {
  const saleData = req.body;
  
  const newSale = await salesServices.addNewSale(saleData);

  if (newSale.error) return next(newSale.error, null, res);

  res.status(201).json(newSale);
};

const updateSale = async (req, res, next) => {
  const saleData = req.body;
  const { id } = req.params;

  const updatedSale = await salesServices.updateSale(id, saleData);

  if (updatedSale.error) return next(updatedSale.error, null, res);

  res.status(200).json(updatedSale);
};

const deleteSale = async (req, res, next) => {
    const { id } = req.params;
    const deletedSale = await salesServices.deleteSale(id);
  
    if (deletedSale.error) return next(deletedSale.error, null, res);
  
    res.status(204).json();
  };

module.exports = {
  getAllSales,
  findSaleById,
  addNewSale,
  updateSale,
  deleteSale,
};
