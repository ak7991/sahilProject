const express = require("express");

var cors = require("cors");
const app = express();
app.use(cors());
const passport = require("passport");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require("mongoose");
const csv = require("csvtojson");
var jwt = require("jsonwebtoken");
var multer = require("multer");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

const fs = require("fs");

mongoose.connect("mongodb://localhost/myDatabase");
var session = require("express-session");

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("App listening on port " + port));

app.use(session({ resave: true, saveUninitialized: true, secret: "testing" }));

app.use(passport.initialize());
app.use(passport.session());

app.post("/convert", loggedIn, upload.single("file"), async function(req, res) {
  console.log(req.file.filename);
  const csvFilePath = "./uploads/" + req.file.originalname;
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      console.log(jsonObj);
    });

  // Async / await usage
  const jsonArray = await csv().fromFile(csvFilePath);
  console.log("Synchronous read: ");
  res.send(jsonArray.toString());
});
