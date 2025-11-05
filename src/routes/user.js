const express = require('express');
const userRouter = express.Router();
const userAuth = require("../middlewares/auth.js");
const connectionRequest = require("../models/connectionRequest.js");

const USER_SAFE_DATA = 'firstName lastName age gender photoUrl bio skills'

userRouter.get("/user/request/panding" , userAuth, async (req , res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate('fromUserId' , USER_SAFE_DATA); 

        res.status(200).json({
            message : "Panding Connection Requests fetched successfully",
            data : connectionRequests
        });


        
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/connections" , userAuth, async (req , res)=>{
    try {
        const loggedInUser = req.user;
        const ConnectionRequest = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId' , USER_SAFE_DATA)
          .populate('toUserId' , USER_SAFE_DATA);

          console.log(ConnectionRequest);

        const data = ConnectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        })
        res.status(200).json({
            message : "Connections fetched successfully",
            data : data
        });
        
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;