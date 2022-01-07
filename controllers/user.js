const Position = require("../models/position");
const Application = require("../models/application");
const User = require("../models/user");
const uploadFile = require("../middleware/upload");

const fs = require("fs");

const events = require("events");
const eventEmitter = new events.EventEmitter();

// @desc Gets All Positions
// @route GET /user/positions
exports.getPositions = (req, res, next) => {
  Position.find({ status: true })
    .then((positions) => {
      return res.status(200).json({ positions });
    })
    .catch((err) => {
      const error = new Error("Positions not found");
      error.statusCode = 404;
      throw error;
    });
};

// @desc Gets Single Position
// @route GET /user/positions/:id
exports.getPosition = (req, res, next) => {
  const posId = req.params.id;
  Position.findById(posId)
    .then((position) => {
      return res.status(200).json({ positions });
    })
    .catch((err) => {
      const error = new Error("Position not found");
      error.statusCode = 404;
      throw error;
    });
};

// @desc Apply for position
// @route POST /user/checkOpening
exports.checkOpening = (req, res, next) => {
  //Get data from request body
  const _userId = req.body._userId;
  const _positionId = req.body._positionId;
  const name = req.body.name;

  Application.find()
    .then((result) => {
      //Check if an entry with _userId and _positionId already exist
      const appExist = result.filter((p) => {
        return (
          //toString() to convert ObjectId to string
          p.user.userId.toString() === _userId &&
          p.position.positionId.toString() === _positionId
        );
      });

      //If the user already applied
      if (appExist.length > 0) {
        return res
          .status(200)
          .json({ success: true, msg: "You already applied" });
      } else {
        //Else create entry in database
        const application = new Application({
          user: {
            name: name,
            userId: _userId.toString(),
          },
          position: {
            positionId: _positionId.toString(),
          },
        });
        application
          .save()
          .then((result) => {
            console.log("Applied");
            eventEmitter.emit("Applied");
            return res
              .status(201)
              .json({ success: true, msg: "Apply for this position" });
          })
          .catch((err) => {
            const error = new Error("Could not apply");
            error.statusCode = 404;
            throw error;
          });
      }
    })
    .catch((err) => {
      const error = new Error("No applications");
      error.statusCode = 404;
      throw error;
    });
};

exports.upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    User.findById(req.user._id).then((result) => {
      result.cv = `./file/${req.file.originalname}`;

      result
        .save()
        .then((result) => {})
        .catch((err) => {
          const error = new Error(err);
          error.statusCode = 500;
          throw error;
        });
    });

    if (req.file == undefined) {
      const error = new Error("Please upload a file!");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      const error = new Error("File size cannot be larger than 2MB!");
      error.statusCode = 500;
      throw error;
    }
    const error = new Error(
      `Could not upload the file: ${req.file.originalname}. ${err}`
    );
    error.statusCode = 500;
    throw error;
  }
};

exports.deleteFile = (req, res, next) => {
  User.findById(req.user._id)
    .then((result) => {
      if (result.cv !== undefined) {
        fs.unlink(result.cv, (err) => {
          if (err) {
            //"Could not delete the file.", err

            next();
          } else {
            //"File deleted"
            next();
          }
        });
      } else {
        //"No file to delete"

        next();
      }
    })
    .catch((err) => {
      //"Unable to scan files!"

      next();
    });
};

exports.download = (req, res) => {
  User.findById(req.user._id)
    .then((result) => {
      if (result.cv) {
        res.download(result.cv, (err) => {
          if (err) {
            const error = new Error("Could not download the file. " + err);
            error.statusCode = 500;
            throw error;
          }
        });
      } else {
        const error = new Error("File does not exist");
        error.statusCode = 500;
        throw error;
      }
    })
    .catch((err) => {
      const error = new Error(err);
        error.statusCode = 500;
        throw error;
    });
};
