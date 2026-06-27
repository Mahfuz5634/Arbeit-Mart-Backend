import express from "express";
import productController from "../controller/productController.js";
import authController from "../controller/authController.js";
const router = express.Router();

router.get('/',productController.getProduct);
router.post('/',productController.createProduct);
router.get('/:id',productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;