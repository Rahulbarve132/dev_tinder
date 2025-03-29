const express = require('express');

const app = express();


app.use("/test",(req, res)=>{
    res.send("hello form test route")
})
app.use("/home",(req, res)=>{
    res.send("hello form home route")
})

app.use("/khali",(req, res)=>{
    res.send("hello form khali route")
})

app.use("/",(req, res)=>{
    res.send("hello form no ")
})


app.listen(7777 ,()=>{
    console.log("server started in port 7777");
})