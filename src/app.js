const express = require("express");
const connectDB = require("./config/database.js");
const app = express();

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const connectionRouter = require("./routes/connections.js");
const cookieParser = require('cookie-parser')   

app.use(express.json());
app.use(cookieParser());




app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);


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
