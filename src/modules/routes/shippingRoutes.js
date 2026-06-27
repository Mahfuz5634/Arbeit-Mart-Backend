import express from "express";
import shippingController from "../controller/shippingController.js";

const router = express.Router();

router.get("/", shippingController.getShippingZones);
router.post("/", shippingController.createShippingZone);
router.put("/:id", shippingController.updateShippingZone);
router.delete("/:id", shippingController.deleteShippingZone);

export default router;
