const express = require('express');
const connectionRouter = express.Router();
const userAuth = require("../middlewares/auth.js");

connectionRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " send the connection request")
})

module.exports = connectionRouter;
