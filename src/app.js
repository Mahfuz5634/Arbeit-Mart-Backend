import express from "express";
import authRoutes from "./modules/routes/authRoute.js"
import productRoutes from "./modules/routes/productRoutes.js"
import couponRoutes from "./modules/routes/couponRoutes.js";
import shippingRoutes from "./modules/routes/shippingRoutes.js";
import orderRoutes from "./modules/routes/orderRoutes.js";
import adminRoutes from "./modules/routes/adminRoutes.js"
import cors from 'cors';


const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello,It's Arbeit Mart Backend")
})

app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/coupon',couponRoutes);
app.use('/api/shipping',shippingRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/admin',adminRoutes)
export default app;