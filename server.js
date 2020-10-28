require("dotenv").config()

const fs = require("fs")

const express = require("express");

const ejs = require("ejs");

const path = require("path");

const expressLayout = require("express-ejs-layouts");

const session  = require("express-session");

const mongoose = require("mongoose");

const flash = require("express-flash");

const passport = require("passport");

const MongoDbStore = require("connect-mongo")(session);


const app = express();


//Database Connection

const url = 'mongodb://localhost:27017/Pizza';
mongoose.connect(url ,{useCreateIndex:true , useNewUrlParser:true,useFindAndModify:true,useUnifiedTopology:true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database Connected');
}).catch(err =>{
    console.log('Connection Failed')
});

//Session Store

let mongoStore = new MongoDbStore({
    mongooseConnection : connection,
    collection : "sessions"
})

//Session Config
app.use(session({

    secret : process.env.COOKIE_SECRET,
    resave : false,
    store : mongoStore,
    saveUninitialized : false,
    cookie : {maxAge : 1000 * 60 * 60 * 24} //24 Hours
}))

//Passport config

const passportInit = require("./app/config/passport")
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

    
//Assets
app.use(express.static("public"));
app.use(flash())
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//Global Middleware for session to be available everywhere

app.use((req , res , next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()  //without next() http request will not complete
})


const PORT = process.env.PORT || 3000 ;






//set Template engine

app.use(expressLayout)
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine','ejs');


require('./routes/web')(app);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)

})