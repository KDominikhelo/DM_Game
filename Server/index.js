const express = require("express");

const app = express();

app.route("getdata").get((req,res)=>{
    res.send("hello");
})


app.listen(3000,console.log("fut"+3000));