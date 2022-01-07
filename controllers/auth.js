const User = require("../models/user");
const utils = require("../lib/utils");
const { validationResult } = require("express-validator/check");

// @desc Validate an existing user and issue a jwt
// @route POST /user/login
exports.loginUser = (req, res, next) => {
  User.findOne({ userName: req.body.userName })
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user");
        error.statusCode = 401;
        throw error;
      }

      //Check if the username and password are valid
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      //If user is valid then issue jwt
      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          user: user,
          expiresIn: tokenObject.expires,
        });
      } else {
        const error = new Error("You entered the wrong password");
        error.statusCode = 401;
        throw error;
      }
    })
    .catch((err) => {
      const error = new Error("Error");
      error.statusCode = 500;
      throw error;
    });
};

// @desc Save user credentials and issue a jwt
// @route POST /user/register
exports.registerUser = (req, res, next) => {
  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }
  const saltHash = utils.genPassword(req.body.password);
  //Creating salt and hash based on user password
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    name: req.body.name,
    userName: req.body.userName,
    hash: hash,
    salt: salt,
    role: req.body.role,
  });

  try {
    newUser.save().then((user) => {
      const jwt = utils.issueJWT(user);

      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    throw error;
  }
};
