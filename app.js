import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";
import encrypt from "mongoose-encryption";


//  import lodash from "lodash"
// const _ = require("lodash");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true}).then(console.log("alright"));

const  userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/", function(req, res){
  res.render("home");
});

// app.post("/logout", function(req, res){
//   res.render("home")
// });

app.post("/register", function(req, res) {
  const newUser = new User ({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save();
  res.render("secrets");
});

app.post("/login", function(req, res){
  User.findOne({username: req.body.username}).then((foundUser)=> {
    if (foundUser.password === req.body.password) {
      res.render("secrets");

    } else {
      console.log("user not found");
      res.render("login", {eTitle: "User not found"});
    };
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
  