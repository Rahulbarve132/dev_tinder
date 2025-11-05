const express = require('express');
const RequestRouter = express.Router();
const userAuth = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

RequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
 try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored" , "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({message : "Invalid status type " + status});
    }

    const toUserExists = await User.findById(toUserId);
    if (!toUserExists) {
      return res.status(404).json({message : "User Not Found"});
    }

   const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
       {fromUserId, toUserId},
       {fromUserId: toUserId, toUserId: fromUserId}
      ]  
    });
    if (existingConnectionRequest) {
      res.status(400).json({message : "Connection request already exists between these users"});
    }

    const connectionRequest = new ConnectionRequest({
         fromUserId,
         toUserId,
        status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: "Connection request sent successfully",
      data,
    })
  
 } catch (err) {
    res.status(400).send("ERROR: " + err.message);
 }
})

RequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatus = ["accepted" , "rejected"];
      if( !allowedStatus.includes(status)) {
        return res.status(400).json({message : "Invalid status type " + status});
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId : loggedInUser._id,
        status : "interested",
      })

      if(!connectionRequest){
        return res.status(404).json({message : "No pending connection request found"});
      }

      connectionRequest.status = status;
      const data =   await connectionRequest.save();
      res.json({message : `Connection request ${status} successfully` , data });  

    
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

});

module.exports = RequestRouter;
