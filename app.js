//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRound = 5;
const session = require('express-session');
const passport = require('passport');
const passportlocalmongoose = require('passport-local-mongoose');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'Our little secret .',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

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

userSchema.plugin(passportlocalmongoose);
//=====using key encriptions of mongoose-encryption
// const secret = "AnyLongStringToCeepMySecret";
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});


// ==== using .env encryption
// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

});

app.post("/login", function(req, res) {

});

app.listen("3000", function() {
  console.log("server runs at 3000");
});
