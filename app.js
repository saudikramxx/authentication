require("dotenv").config()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const express = require("express");
const mongoose = require("mongoose")
const md5 = require("md5")
const encrypt = require("mongoose-encryption")
const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema ({
    email:String,
    password:String

})
const User = mongoose.model("User",userSchema)


app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})
app.post("/login",function(req,res){
    const username = req.body.username
    const password = md5(req.body.password)
    User.findOne({email:username},function(err,foundUser){
        if(!err){
            if(foundUser) {
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }

        }else{
            console.log(err)
        }
    })
    })

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
    
    const user = new User({
        email: req.body.username,
        password :md5( req.body.password)

    })
    user.save(function(err){
        if(!err){
            res.render("secrets")
        }else{
            console.log(err)
        }
    });
    
})




app.listen(3000,function(){
    console.log("server is up and running")
})