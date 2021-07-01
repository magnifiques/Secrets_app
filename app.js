//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require(("mongoose-encryption"));

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
    username:String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SELECT, encryptedFields: ['password'] });

const User = mongoose.model("user", userSchema);




app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
     
    const user = new User({
    username: req.body.username,
    password: req.body.password
    })
    
    user.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err)
        }
    })
});

app.post("/login", function(req, res){
    const userlogin = req.body.username;
    const password = req.body.password;

    User.findOne({username: userlogin}, function(err, foundUser){
        if(foundUser.password == password){
            res.render("secrets");
        }
        else{
            console.log(err)
        }
    })
})
app.listen("3000", function(){
    console.log("successfully on 3000");
})