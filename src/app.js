import express from "express";

const app=express();

app.get("/",(req,res)=>{
    res.send("Hello,It's Arbeit Mart Backend")
})
export default app;