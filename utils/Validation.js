const validator =require('validator')
const validateSignupData = (req) =>{
  const {firstName,lastName,emailId,password} =req.body
  if(!firstName || !lastName){
    throw new Error("Please Check the names")
  }else if(!validator.isEmail(emailId)){
    throw new Error("Please Enter a Valid Email")
  }else if(!validator.isStrongPassword(password)){
   throw new Error("Please Enter a Strong Password")
  }
}
module.exports ={ validateSignupData } 

