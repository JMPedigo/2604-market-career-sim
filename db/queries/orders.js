import db from "#db/client";

/** Creates a new order */
export async function createOrder({ date, note, user_id }) {
  const sql = `
    INSERT INTO orders
      (date, note, user_id)
    VALUES
      ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, user_id]);
  return order;
}

/** Gets all orders made by logged-in user */
export async function getOrdersByUserId(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

// sends the order with the specified id
export async function getOrderById(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

// Adds a product to an order
export async function addProductToOrder(orderId, productId, quantity) {
  const sql = `
  INSERT INTO order_products
    (order_id, product_id, quantity)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [packingList],
  } = await db.query(sql, [orderId, productId, quantity]);
  return packingList;
}

/** Sends the array of products in the order */
