const connection = require('./connection');

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

module.exports = {
    addNewSale,
    deleteSale,
  };