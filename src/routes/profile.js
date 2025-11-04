const express = require("express");
const userAuth = require("../middlewares/auth.js");
const { validateProfileFields } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile: " + err.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    if (!validateProfileFields(req)) {
      throw new Error("Invalid profile fields");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({message: `${loggedInUser.firstName} your Profile updated successfully`, user: loggedInUser});
  } catch (err) {
    res.status(400).send("Error updating profile: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("Old and new passwords are required");
    }
    const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    loggedInUser.password = newPassword;
    await loggedInUser.save();
    res.status(200).send("Password updated successfully");

  }catch(err){
    res.status(400).send("Error updating password: " + err.message);
  }
})


module.exports = profileRouter;




