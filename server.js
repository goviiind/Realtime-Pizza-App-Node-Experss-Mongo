const express = require("express");

const ejs = require("ejs");

const path = require("path");

const expressLayout = require("express-ejs-layouts");

const app = express();

const PORT = process.env.PORT || 3000 ;


app.use(express.static("public"));



//set Template engine

app.use(expressLayout)
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine','ejs');


app.get("/", (req,res) => {
    res.render("home")
})

app.get("/cart", (req,res) => {
    res.render("./customer/cart");
})

app.get("/register", (req , res) =>{
    res.render("./auth/register")
})

app.get("/login", (req , res) =>{
    res.render("./auth/login")
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)

})