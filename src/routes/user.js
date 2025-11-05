const express = require('express');
const userRouter = express.Router();
const userAuth = require("../middlewares/auth.js");
const connectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

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

userRouter.get("/feed", userAuth , async(req, res)=>{
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if(limit > 50) limit = 50;
        const skip = (page - 1) * limit;

        const coneectionRequests = await connectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select('fromUserId toUserId');

        const hideUserFromFeed = new Set();
        coneectionRequests.forEach((row)=>{
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        });

        const feedUsers = await User.find({
            $and: [
                   { _id : {$nin : Array.from(hideUserFromFeed)},},
                   { _id : {$ne : loggedInUser._id} },
            ]   
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        
        res.status(200).json({
            message : "Feed fetched successfully",
            data : feedUsers
        });

        
        
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;