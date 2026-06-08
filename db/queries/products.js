import db from "#db/client";

export async function createProduct({ title, description, price }) {
  const sql = `
    INSERT INTO products
      (title, description, price)
    VALUES
      ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [product],
  } = await db.query(sql, [title, description, price]);
  return product;
}

/** GET /products sends array of all products */
export async function getProducts() {
  const sql = `
    SELECT *
    FROM products
    `;
  const { rows: products } = await db.query(sql);
  return products;
}

/** GET /products/:id
 * sends 404 if the product with that id does not exist
 * sends the specific product
 */
export async function getProductById(id) {
  const sql = `
    SELECT *
    FROM products
    WHERE id = $1
    `;
  const {
    rows: [product],
  } = await db.query(sql, [id]);
  return product;
}

/** 🔒 GET /products/:id/orders
 * sends 404 if the product with that id does not exist (even if the user is logged in!)
 * sends an array of all orders made by the user that include this product */
export async function getProductsByOrderId(id) {
  const sql = `
    SELECT products.*
    FROM
      products
      JOIN orders_products ON orders_products.product_id = products.id
      JOIN orders ON orders.id = orders_products.orders_id
    WHERE orders.id = $1
    `;
  const { rows: products } = await db.query(sql, [id]);
  return products;
}
