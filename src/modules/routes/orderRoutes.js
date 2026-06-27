import express from "express";
import orderController from "../controller/orderController.js";

const router = express.Router();

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);
router.put("/:id/status", orderController.updateOrderStatus);

export default router;
