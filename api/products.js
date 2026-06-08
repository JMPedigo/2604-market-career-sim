import express from "express";
const router = express.Router();
export default router;

import { getProducts } from "#db/queries/products";

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});
