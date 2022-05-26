const connection = require('./connection');

const getAllProducts = async () => {
  const query = `
    SELECT * 
    FROM StoreManager.products;`;

  const [allProducts] = await connection.execute(query);
  return allProducts;
};

const findProductById = async (id) => {
  const query = `
    SELECT * 
    FROM StoreManager.products 
    WHERE id = ?;`;

  const [productById] = await connection.execute(query, [id]);
  if (productById.length === 0) return null;
  return productById[0];
};

module.exports = {
  getAllProducts,
  findProductById,
};
