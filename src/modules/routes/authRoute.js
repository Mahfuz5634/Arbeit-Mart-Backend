import authController from "../controller/authController.js";
import express from 'express';

const router=express.Router();

router.post('/register',authController.registerUser);
router.post('/login',authController.loginUser);

export default router;