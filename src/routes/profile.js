const express = require("express");
const userAuth = require("../middlewares/auth.js");
const { validateProfileFields } = require("../utils/validation.js");

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
    res.status(200).send("Profile updated successfully");
  } catch (err) {
    res.status(400).send("Error updating profile: " + err.message);
  }
});

module.exports = profileRouter;
