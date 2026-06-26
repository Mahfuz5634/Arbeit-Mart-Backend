import express from "express";
import authRoutes from "./modules/routes/authRoute.js"

const app=express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello,It's Arbeit Mart Backend")
})

app.use('/api/auth',authRoutes);
export default app;