const express = require('express');

const app = express();

app.get("/user", (req , res)=>{
    res.send({user_name : "rahul", age : 21})
})

app.post("/user", (req, res)=>{
    res.send ("user created")
})

app.patch("/user", (req, res)=>{
    res.send ("user updated")
})

app.delete("/user", (req, res)=>{
    res.send ("user deleted")
})


app.use("/test",(req, res)=>{
    res.send("hello form test route")
})



app.listen(7777 ,()=>{
    console.log("server started in port 7777");
})