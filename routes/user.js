const express = require("express");
const { body } = require("express-validator");

const bodyParser = require("body-parser").json();
const passport = require("passport");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", bodyParser, authController.loginUser);

router.post(
  "/register",
  bodyParser,
  [
    body("userName")
    .isLength({ min: 5 })
      .withMessage("Username must have at least 5 characters"),
    body(
      "password",
      "Password must be alphanumeric and have at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.registerUser
);

router.get(
  "/positions",
  passport.authenticate("jwt", { session: false }),
  userController.getPositions
);

router.get(
  "/positions/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getPosition
);

router.post(
  "/checkOpening",
  bodyParser,
  passport.authenticate("jwt", { session: false }),
  userController.checkOpening
);

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  userController.deleteFile,
  userController.upload
);

router.get(
  "/file/",
  passport.authenticate("jwt", { session: false }),
  userController.download
);

module.exports = router;
