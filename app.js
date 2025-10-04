const express =require('express');
const app =express();
app.get('/',(req,res)=>{
    res.send("Hello Jishnu Welcome to node.js and express.js and mongoDB");
})
app.get('/home',(req,res)=>{
    res.send("Welcome to HomePage");
})
app.get('/about',(req,res)=>{
    res.send("Welcome to about Page")
})
app.listen(3000,()=>{
    console.log("Your server is running successfully at 3000");
    
})