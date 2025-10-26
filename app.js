const express = require("express");
const connectDB = require("../src/Config/Database");
const validator = require("validator");
const app = express();
const cookieParser = require('cookie-parser');

const authRouter =require('./Routes/auth')
const profileRouter =require('./Routes/profile')
const requestRouter =require('./Routes/request')
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
