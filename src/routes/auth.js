const express = require("express");
const User = require("../models/user.js");
const {validatorSignUp} = require("../utils/validation.js");
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
   try {

  // Validate required fields
  validatorSignUp(req);

  const {firstName, lastName, email, password} = req.body;
  const passwordHash = await bcrypt.hash(password, 10) ;

  const user = new User(
    {
      firstName,
      lastName,
      email,
      password : passwordHash,
    }
  );

    // Store hash in your password DB);
    await user.save();
    res.send("user created");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req ,res)=>{
  try{
  const {email , password} = req.body ; 
  const user = await User.findOne({email: email});
  if(!user){
    throw new Error("Invalid credentials");
  }
  const isMatch = await user.passwordValidate(password);
  if(isMatch){
    const token = await user.getJWT();

    res.cookie("token", token ,{expires: new Date(Date.now() + 168 * 3600000)})
    return res.status(200).send("Login successful");
  }
  else{
    return res.status(400).send("Invalid credentials")};
  }catch(err){
    res.status(400).send("Error logging in: " + err.message);
  }
})

authRouter.post("/logout", async (req ,res)=>{
  res.cookie("token", null ,{
    expires: new Date(Date.now())
  })
  res.send("Logout sucessfuly")
})


module.exports = authRouter ;  