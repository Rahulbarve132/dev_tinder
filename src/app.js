const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "rohan",
    lastName: "kl",
    email: "kalu@don.com",
    password: "kalu@123",
    age: "22",
  });

  try {
    await user.save();
    res.send("user created");
  } catch (err) {
    res.status(400).send("user not created", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("server started in port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
