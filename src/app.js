const express = require('express');

const app = express();

app.use("/user", (req, res ,next)=>{
    console.log("Middleware 1");
    next();
},
(req, res ,next)=>{
    console.log("Middleware 2");
    next();
},
(req, res ,next)=>{
    console.log("Middleware 3");
    res.send("hello form hero 45")
})


app.listen(7777 ,()=>{
    console.log("server started in port 7777");
})