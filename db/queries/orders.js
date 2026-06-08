import db from "#db/client";

export async function createOrder(date, note, user_id) {
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
