const connection = require('./connection');

const getAllProducts = async () => {
  const query = `
    SELECT * 
    FROM StoreManager.products
    ORDER BY StoreManager.products.id ASC;`;

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

const findProductByName = async (name) => {
    const query = `
      SELECT * 
      FROM StoreManager.products
      WHERE name = ?;`;
  
    const [product] = await connection.execute(query, [name]);
    if (product.length === 0) return null;

    return product;
  };

const addNewProduct = async (name, quantity) => {
  const query = `
    INSERT 
    INTO StoreManager.products
    (name, quantity) VALUES (?, ?)`;

    const [newProduct] = await connection.execute(query, [name, quantity]);
    return newProduct.insertId;
  };

module.exports = {
  getAllProducts,
  findProductById,
  addNewProduct,
  findProductByName,
};
