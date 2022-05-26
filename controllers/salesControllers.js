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

module.exports = {
  getAllSales,
  findSaleById,
};
