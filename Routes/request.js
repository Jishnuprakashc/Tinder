const express =require('express')
const requestRouter =express.Router()
const {userAuth} =require('../Middleware/AdminAuth')
requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
  const user = req.user;
  //sending connection request
  console.log("Sending Connection Request");
  res.send(user.firstName + "Send you the connection request")
  
})
module.exports = requestRouter