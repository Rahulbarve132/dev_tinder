const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
   try{
    const { token }  = req.cookies;
    if (!token){
        throw new Error("Unauthorized: No token provided");
    }
    const decodedMessage = jwt.verify(token, "DEVTINDER@123");
    const userId = decodedMessage._id;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("Unauthorized: User not found");
    }

    req.user = user; // Attach user to request object
    next(); // Call the next middleware or route handler
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = userAuth;