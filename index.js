var _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const csv = require("csvtojson");
const excelToJson = require("convert-excel-to-json");
var cors = require("cors");
var passport = require("passport");
var passportJWT = require("passport-jwt");
var multer = require("multer");
const fs = require("fs");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

var users = [
  {
    id: 1,
    name: "admin",
    password: "admin"
  },
  {
    id: 2,
    name: "test",
    password: "test"
  }
];

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "tasmanianDevil";

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log("payload received", jwt_payload);
  var user = users[_.findIndex(users, { id: jwt_payload.id })];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

var app = express();
app.use(cors());
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.json({ message: "Express is up!" });
});

app.post("/login", function(req, res) {
  console.log("req.body", req.body);
  if (req.body.name && req.body.password) {
    var name = req.body.name;
    var password = req.body.password;
  }
  var user = users[_.findIndex(users, { name: name })];
  if (!user) {
    res.status(401).json({ message: "no such user found" });
  } else if (user.password === req.body.password) {
    var payload = { id: user.id };
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ message: "ok", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

app.get("/secret", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  res.json({ message: "Success! You can not see this without a token" });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.send("Logged Out", 200);
});
app.post(
  "/convert",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  async function(req, res) {
    console.log("test", req.file.filename);
    const filePath = "../uploads/" + req.file.originalname;

    let ext = req.file.originalname.split(".")[1];
    console.log("ext", ext);
    if (ext == "csv") {
      let resArray = [];
      await csv()
        .fromFile(filePath)
        .then(jsonObj => {
          resArray.push(jsonObj);
        });
      res.json({ results: resArray });
    } else if (ext == "xlsx" || ext == "xls") {
      const result = excelToJson({
        source: fs.readFileSync(filePath)
      });
      res.json({ results: result });
    }
  }
);
app.listen(4000, function() {
  console.log("Express running");
});
