const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const {validatorSignUp} = require("./utils/validation.js");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')   
const userAuth = require("./middlewares/auth.js");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req ,res)=>{
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

app.get("/profile",userAuth, async (req, res)=>{
  try{
    const user = req.user; 
    res.status(200).send(user);  
  }catch(err){
    res.status(400).send("Error fetching profile: " + err.message);
  }
})

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " send the connection request")
})



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
