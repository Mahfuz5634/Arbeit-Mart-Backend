import express from "express";
import authRoutes from "./modules/routes/authRoute.js"
import productRoutes from "./modules/routes/productRoutes.js"
import cors from 'cors';


const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello,It's Arbeit Mart Backend")
})

app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
export default app;