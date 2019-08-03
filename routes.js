var express = require("express");
const UserDetails = require("./UserDetails");
//Creating Router() object

var router = express.Router();

// Provide all routes here, this is for Home page.

// Tell express to use this router with /api before.
// You can put just '/' if you don't want any sub path before routes.

router.post("/login", function(req, res) {
  console.log("req.body", req.body);
  console.log("req.body.username", req.body.username);
  console.log("req.body.password", req.body.passowrd);

  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
  }
  var user = UserDetails.findOne(
    {
      username: username
    },
    (err, user) => {
      console.log("user", user);
      if (user == null) {
        res.status(401).json({ message: "no such user found" });
      } else if (user.password === req.body.password) {
        var payload = { username: user.username };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "ok", token: token });
      } else {
        res.status(401).json({ message: "passwords did not match" });
      }
    }
  );
});

router.get("/logout", function(req, res) {
  req.logout();
  res.send("Logged Out", 200);
});
router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    res.json("Success! You can not see this without a token");
  }
);

router.post("/convert", loggedIn, upload.single("file"), async function(
  req,
  res
) {
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

router.get("/error", (req, res) => res.send("error logging in"));

module.exports = router;
