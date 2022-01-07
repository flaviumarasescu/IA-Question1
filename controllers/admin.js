const Position = require("../models/position");
const Application = require("../models/application");
const { validationResult } = require("express-validator/check");

const events = require("events");
const eventEmitter = new events.EventEmitter();

// @desc Add Opening
// @route POST /admin/addOpening
exports.addOpening = (req, res, next) => {
  const projectName = req.body.projectName;
  const clientName = req.body.clientName;
  const technologies = req.body.technologies;
  const role = req.body.role;
  const jobDescription = req.body.jobDescription;
  const status = req.body.status;
  const creatorId = req.user._id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const opening = new Position({
    creatorId: creatorId,
    projectName: projectName,
    clientName: clientName,
    technologies: technologies,
    role: role,
    jobDescription: jobDescription,
    status: status,
  });
  opening
    .save()
    .then((result) => {
      console.log("opening");
      eventEmitter.emit("opening");
      return res.status(201).json({ success: true, msg: "Opening added" });
    })
    .catch((err) => {
      const error = new Error("Could not add Opening ");
      error.statusCode = 500;
      throw error;
    });
};

// @desc Update Opening
// @route PUT /admin/updateOpening/:id
exports.updateOpening = (req, res, next) => {
  const projectName = req.body.projectName;
  const clientName = req.body.clientName;
  const technologies = req.body.technologies;
  const role = req.body.role;
  const jobDescription = req.body.jobDescription;
  const status = req.body.status;

  const openingId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  Position.findById(openingId)
    .then((position) => {
      if (status === undefined) {
        status = position.status;
      }

      (position.projectName = projectName || position.projectName),
        (position.clientName = clientName || position.clientName),
        (position.technologies = technologies || position.technologies),
        (position.role = role || position.role),
        (position.jobDescription = jobDescription || position.jobDescription),
        (position.status = status);

      position
        .save()
        .then((result) => {
          if (position.status === false) {
            //Check if there are applicants for this position
            Application.find().then((result) => {
              //Array with all applicants
              const applicants = result.filter((p) => {
                return (
                  //toString() to convert ObjectId to string
                  p.position.positionId.toString() === openingId
                );
              });
              console.log(
                "The following persons applied for this position:",
                applicants
              );
            });
          }

          console.log("opening updated");
          eventEmitter.emit("opening updated");
          return res
            .status(200)
            .json({ success: true, msg: "Opening updated" });
        })
        .catch((err) => {
          const error = new Error("Could not UPDATE Opening ");
          error.statusCode = 500;
          throw error;
        });
    })
    .catch((err) => {
      const error = new Error("Opening not found");
      error.statusCode = 404;
      throw error;
    });
};

// @desc Delete Opening
// @route DELETE /admin/deleteOpening/:id
exports.deleteOpening = (req, res, next) => {
  const id = req.params.id;

  Position.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount > 0) {
        return res
          .status(200)
          .json({ success: true, msg: "Opening destroyed" });
      } else {
        const error = new Error("Opening not found");
        error.statusCode = 404;
        throw error;
      }
    })
    .catch((err) => {
      const error = new Error("Opening not found");
      error.statusCode = 404;
      throw error;
    });
};

// @desc  Check Applications For An Opening
// @route GET /admin/checkApplicants/:id
exports.checkApplicants = (req, res, next) => {
  const creatorId = req.user._id;

  const positionId = req.params.id;

  Position.findById(positionId)
    .then((result) => {
      //Check if the user created this position so it can access it
      if (creatorId.toString() === result.creatorId.toString()) {
        Application.find({ "position.positionId": positionId })
          .then((result) => {
            return res.status(200).json({ result });
          })
          .catch((err) => {
            const error = new Error("No applications");
            error.statusCode = 404;
            throw error;
          });
      } else {
        //Check if the user did not created this position then he can not access it
        const error = new Error("You don't have access");
        error.statusCode = 404;
        throw error;
      }
    })
    .catch((err) => {
      const error = new Error("No position found");
      error.statusCode = 404;
      throw error;
    });
};
