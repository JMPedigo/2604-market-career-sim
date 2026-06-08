import db from "#db/client";

export async function createPackingList(orderId, productId) {
  const sql = `
    INSERT INTO packing_lists
      (order_id, product_id)
    VALUES
      ($1, $2)
    RETURNING *
    `;
  const {
    rows: [packingList],
  } = await db.query(sql, [orderId, productId]);
  return packingList;
}
