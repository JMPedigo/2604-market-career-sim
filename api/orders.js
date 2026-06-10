import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import { createOrder, getOrderById, getOrdersByUserId } from "#db/queries/orders";

router.use(requireUser);

/** middleware for createOrder */
router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request Body is required.");

  const { date, note, user_id } = req.body;
  if (!date) return res.status(400).send("Request body requires date.");

  const order = await createOrder(date, note, user_id);
  res.status(201).send(order);
});

/** middleware for getOrdersByUserId */
router.get("/", async (res, req) => {
  const orders = await getOrdersByUserId(id);
  res.send(orders);
});

/** Routing middleware that allows reuse of the logic for parsing ID parameter */
router.param("/:id", (req,res, next, id) => {
    const order = await getOrderById(id);
    if (!order) return res.status(404).send("Order not found.");

    if (req.order.user_id !== req.user.id) return res.status(403).send("You are not authorized to view this order.");

    req.order = order;
    next();
});

router.get("/:id", (req, res) => {
    res.status(200).send(req.order);
});

