const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

//Passport verification options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// app.js will pass the global passport object here, and this function will configure it
// Trigger on passport.authenticate
module.exports = (passport) => {
  // JwtStrategy validated the jwt
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {

      // We will assign the `sub` property on the JWT to the database ID of user
      User.findOne({ _id: jwt_payload.sub })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
};
 