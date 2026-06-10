import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import {
  addProductToOrder,
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getProductsByOrderId,
} from "#db/queries/orders";
import requireBody from "#middleware/requireBody";
import { getProductById } from "#db/queries/products";

router.use(requireUser);

/** middleware for createOrder */
router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request Body is required.");

  const { date, note } = req.body;
  if (!date) return res.status(400).send("Request body requires date.");

  const order = await createOrder({ date, note, user_id: req.user.id });
  res.status(201).send(order);
});

/** middleware for getOrdersByUserId */
router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

/** 🔒 GET /orders/:id */
router.get("/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);
  // sends 404 if the order does not exist
  if (!order) return res.status(404).send("Order not found.");
  // sends 403 if the logged-in user is not the user who made the order
  if (order.user_id !== req.user.id)
    return res.status(403).send("You are not authorized to view this order.");

  res.send(order);
});

/** 🔒 POST /orders/:id/products */
router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const { productId, quantity } = req.body;
    const { id } = req.params;

    // sends 400 if the productId references a product that does not exist
    const product = await getProductById(productId);
    if (!product) return res.status(400).send("Product not found.");

    //sends 400 if the request body does not include a productId and a quantity
    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .send("Request body requires productId and quantity.");
    }

    // sends 404 if the order does not exist
    const order = await getOrderById(id);
    if (!order) return res.status(404).send("Order not found.");

    //sends 403 if the logged-in user is not the user who made the order
    if (order.user_id !== req.user.id)
      return res.status(403).send("You are not authorized to view this order.");

    // adds the specified quantity of the product to the order and sends the created orders_products record with status 201
    const packingList = await addProductToOrder(
      req.params.id,
      productId,
      quantity,
    );
    res.status(201).send(packingList);
  },
);

/** 🔒 GET /orders/:id/products */
router.get("/:id/products", async (req, res) => {
  //sends 404 if the order does not exist
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send("Order not found.");

  //sends 403 if the logged-in user is not the user who made the order
  if (order.user_id !== req.user.id)
    return res.status(403).send("You are not authorized to view this order.");

  //sends the array of products in the order */
  const products = await getProductsByOrderId(req.params.id);
  res.send(products);
});
