const express = require("express");
const connectDB = require("../src/Config/Database");
const User = require("./models/user");
const validator = require("validator");
const { validateSignupData } = require("./utils/Validation");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt =require('jsonwebtoken');
const { userAuth} =require("./Middleware/AdminAuth")
app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});
app.get("/profile", userAuth, async (req,res) =>{
 try {
  const user = req.user;
  res.send(user);
 } catch (err) {
  res.status(400).send("ERROR :" + err.message);
 }

})
app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try { 
    const user = await User.findByIdAndDelete(userId);
    console.log("Received userId:", userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  //validation of data
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    
    //bcrypt the password
    const PasswordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId :emailId.toLowerCase(),
      password: PasswordHash,
    });

    await newUser.save();
    res.send("User Added Successfully");
  } catch (err) { 
    res.status(400).send(err.message);
  }
});
//login page
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({  emailId: emailId.toLowerCase() });
    if (!user) {
      throw new Error("Invalid Credential");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      //Create a JWT Token

      const token = await jwt.sign({_id: user._id},"mySecretkey",{expiresIn:"7d"})
      console.log(token);
      
      res.cookie("token",token,{
        httpOnly:true,
        maxAge:60 * 60 * 1000,
      })
       res.send("Login Successfull");
      
    }else{
         throw new Error("Invalid  password");
    }

   
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

app.patch("/user", async (req, res) => {
  const disallowed = ["emailId", "password"];
  const attemptedFields = Object.keys(req.body);
  const forbidden = attemptedFields.filter((field) =>
    disallowed.includes(field)
  );
  if (forbidden.length > 0) {
    return res
      .status(400)
      .send(`Updates are not allowed for fields ${forbidden.join(" , ")}`);
  }

  const { id, firstName, lastName, skills, gender } = req.body;
  if (skills.length > 3) {
    return res.status(400).send("You cannot add more than 3 skills ");
  }
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, emailId, skills, gender },
      { new: true, runValidators: true }
    );
    res.send("Result Updated Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established successfully");
    app.listen(3000, () => {
      console.log("Server is running Successfully on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
