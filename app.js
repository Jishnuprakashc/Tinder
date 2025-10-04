const express =require('express');
const app =express();
app.get("/user",(req,res)=>{
    res.send({Name:"jishnu",age:"26",gender:"male"})
})
app.post("/user",(req,res)=>{
    res.send("You have posted successfully")
})
app.delete("/user",(req,res)=>{
    res.send("You have deleted successfully")
})
app.listen(3000,()=>{
    console.log("Your server is running successfully at 3000");
    
})