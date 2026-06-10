import express from "express";
const router = express.Router();
export default router;

import {
  getOrdersByProductId,
  getProductById,
  getProducts,
} from "#db/queries/products";
import requireUser from "#middleware/requireUser";

/** GET /products sends array of all products */
router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

/** I need to add router.param, since I am going to be reusing the logic for id */
router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product not found.");
  req.product = product;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.product);
});

router.use(requireUser);

/** 🔒 GET /products/:id/orders */
router.get("/:id/orders", async (req, res) => {
  const orders = await getOrdersByProductId(req.params.id, req.user.id);

  res.send(orders);
});
