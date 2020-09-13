//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRound = 5;


const app = express();
//let posts=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

// schema for User db in simple js object
// const userSchema={
//   email:String,
//   password:String
// };

// schem for User Db in proper mongoose userSchema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//=====using key encriptions of mongoose-encryption
// const secret = "AnyLongStringToCeepMySecret";
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});


// ==== using .env encryption
// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.username, saltRound, function(err, hash) {
    //store hash
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    console.log(hash);
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

  // console.log(req.body.username);
  // const newUser = new User( {
  //     email:req.body.username,
  //     password:md5(req.body.password)
  //   });
  //   newUser.save(function(err){
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("secrets");
  //     }
  //   });

  // const username = req.boy.username;
  // console.log(username);
  // const password = req.body.password;
  // // we only let user inn main page(secrets) if they registered first
  // if (!password && !username) {
  //   console.log("enter fieldes");
  // }else {
  //   const newUser = new User( {
  //     email:username,
  //     password:password
  //   });
  //   newUser.save(function(err){
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("secrets");
  //     }
  //   });
  // }
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  // console.log(username);
  const password = req.body.password;
  console.log(password);
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        // if(foundUser.password === password){
        //   res.render("secrets");
        bcrypt.compare(password, foundUser.password, function(err, result) {
          //result==true
          console.log(foundUser.password);
          console.log(password);
          console.log(result);
          if (result === true) {
            res.render("secrets");
          } else {
            console.log("not found");
          }
        });
      }
    }

  });
});

app.listen("3000", function() {
  console.log("server runs at 3000");
});
