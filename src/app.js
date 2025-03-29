const express = require('express');

const app = express();

app.get("/user/:id",(req , res)=>{ 
    console.log(req.params);
    res.send("hello user");
})

app.get("/user",(req , res)=>{ 
    console.log(req.query);
    res.send("hello user query");
})

app.get("/ab?c",(req, res)=>{
    console.log({name:"he", age: 20});
    res.send("hello ab?c");
})

app.get("/ab+c", (req, res)=>{
    res.send("working")
})

app.get("/ab*c", (req, res)=>{
    res.send("hero hum")
})

app.get("/*fly/:id",(req, res)=>{
    console.log(req.params)
    res.send("hello fly")
})





app.listen(7777 ,()=>{
    console.log("server started in port 7777");
})