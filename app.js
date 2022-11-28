require("dotenv").config()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const encrypt = require("mongoose-encryption")
const app = express()
const saltRounds =10
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
    const password = req.body.password
    
        User.findOne({email:username},function(err,foundUser){
            if(!err){
                if(foundUser) {
                    bcrypt.compare(password,foundUser.password,function(err,result){

                        if (result === true){
                            res.render("secrets")
                        }
                        
                    })
                        
                    
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
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const user = new User({
            email: req.body.username,
            password : hash
    
        })
        user.save(function(err){
            if(!err){
                res.render("secrets")
            }else{
                console.log(err)
            }
        });
    })
    
    
    
})




app.listen(3000,function(){
    console.log("server is up and running")
})