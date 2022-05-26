const connection = require('./connection');

const addNewSale = async (saleId, productId, quantity) => {
    const query = `
      INSERT 
      INTO StoreManager.sales_products
      (sale_id, product_id, quantity) VALUES (?, ?, ?)`;
  
    connection.execute(query, [saleId, productId, quantity]);
  };

module.exports = {
    addNewSale,
  };