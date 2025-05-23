const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  
  try {
    await user.save();
    res.send("user created");
  } catch (err) {
    res.status(400).send("user not created", err.message);
  }
});

app.get("/user", async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(404).send("User not found");
        }else{
            return res.status(200).send(user);
        }
    }catch(err){
        res.status(404).send("Error fetching user", err.message);
    }
})

app.get("/feed", async(req, res)=>{
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }catch(err){
        res.status(404).send("Error fetching users", err.message);
    }
})

app.patch("/user", async (req, res)=>{
  const userId = req.body.userId;
  const data = req.body;
  console.log(data);
  try{
    const user = await User.findByIdAndUpdate(userId, data ,{
      runValidators: true,
    });
    res.status(200).send("User updated");
  }catch(err){
    res.status(400).send("Error updating user", err.message);
  }

})

app.delete("/user", async (req, res)=>{
  const userId = req.body.userId ;
  try{
    const user =await User.findByIdAndDelete(userId);
    res.status(200).send("user deleted");
    if(!user){
      return res.status(404).send("User not found");
  }}catch(err){
    res.status(400).send("Error deleting user", err.message);
  }
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
