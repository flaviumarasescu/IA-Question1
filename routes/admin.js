const express = require("express");

const bodyParser = require("body-parser").json();

const { body } = require("express-validator/check");

const passport = require("passport");

const adminController = require("../controllers/admin");

const authorization = require("../middleware/isAdmin");

const router = express.Router();

router.post(
  "/addOpening",
  bodyParser,
  [
    body("projectName")
      .isLength({ min: 5 })
      .withMessage("Username must have at least 5 characters"),
    body(
      "clientName",
      "Username must have at least 5 characters and need to be alphanumeric"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  passport.authenticate("jwt", { session: false }),
  authorization.isAdmin,
  adminController.addOpening
);

router.put(
  "/updateOpening/:id",
  bodyParser,
  [
    body("projectName")
      .isLength({ min: 5 })
      .withMessage("Username must have at least 5 characters"),
    body(
      "projectName",
      "Username must have at least 5 characters and need to be alphanumeric"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  passport.authenticate("jwt", { session: false }),
  authorization.isAdmin,
  adminController.updateOpening
);

router.delete(
  "/deleteOpening/:id",
  bodyParser,
  passport.authenticate("jwt", { session: false }),
  authorization.isAdmin,
  adminController.deleteOpening
);

router.get(
  "/checkApplicants/:id",
  bodyParser,
  passport.authenticate("jwt", { session: false }),
  authorization.isAdmin,
  adminController.checkApplicants
);

module.exports = router;
