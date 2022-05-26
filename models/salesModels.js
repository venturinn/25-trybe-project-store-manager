const connection = require('./connection');

const serialize = (allSales) => allSales.map((item) => ({
    saleId: item.sale_id,
    date: item.date,
    productId: item.product_id,
    quantity: item.quantity,
    }));

const getAllSales = async () => {
  const query = `
    SELECT salesProducts.sale_id, sales.date, salesProducts.product_id, salesProducts.quantity
    FROM StoreManager.sales AS sales
    INNER JOIN StoreManager.sales_products AS salesProducts
    ON sales.id = salesProducts.sale_id
    ORDER BY sales.id ASC, salesProducts.product_id ASC;`;

  const [allSales] = await connection.execute(query);
  return serialize(allSales);
};

const findSaleById = async (id) => {
  const query = `
    SELECT sales.date, salesProducts.product_id, salesProducts.quantity
    FROM StoreManager.sales AS sales
    INNER JOIN StoreManager.sales_products AS salesProducts
    ON sales.id = salesProducts.sale_id
    WHERE sales.id = ?;`;

  const [saleById] = await connection.execute(query, [id]);
  if (saleById.length === 0) return null;
  return serialize(saleById);
};

module.exports = {
  getAllSales,
  findSaleById,
};