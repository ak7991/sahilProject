const passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwt = require("jsonwebtoken");

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log("payload received", jwt_payload);
  UserDetails.findOne(
    {
      username: jwt_payload.username
    },
    function(err, user) {
      if (err) {
        return done(err);
      }

      if (user == null) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }
      if (user.password == password) {
        return done(null, user);
      }
    }
  );
});

passport.use(strategy);

module.exports = passport;
