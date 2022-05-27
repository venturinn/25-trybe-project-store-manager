const connection = require('./connection');

const serialize = (saleProductsData) => saleProductsData.map((item) => ({
  saleId: item.sale_id,
  productId: item.product_id,
  quantity: item.quantity,
  }));

const addNewSale = async (saleId, productId, quantity) => {
  const query = `
      INSERT 
      INTO StoreManager.sales_products
      (sale_id, product_id, quantity) VALUES (?, ?, ?)`;

  connection.execute(query, [saleId, productId, quantity]);
};

const deleteSale = async (id) => {
  const query = `
      DELETE 
      FROM StoreManager.sales_products
      WHERE sale_id = ?;`;

  await connection.execute(query, [id]);
};

const getSaleProductsData = async (id) => {
  const query = `
      SELECT * 
      FROM StoreManager.sales_products
      WHERE sale_id = ?;`;

  const [saleProductsData] = await connection.execute(query, [id]);
  return serialize(saleProductsData);
};

module.exports = {
  addNewSale,
  deleteSale,
  getSaleProductsData,
};
