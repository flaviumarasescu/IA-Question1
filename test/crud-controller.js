const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const adminCrudController = require("../controllers/admin");
const userCrudController = require("../controllers/user");

describe("Crud Controller", function () {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://admin:admin@cluster0.pxg82.mongodb.net/iaquestion2"
      )
      .then((result) => {
        const user = new User({
          name: "user3",
          userName: "userName3",
          password: "user3",
          role: "user",
          _id: "61d765391ccbbd9fe813274f",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function () {});

  afterEach(function () {});

  it("should add a new opening", function (done) {
    const req = {
      body: {
        projectName: "projectName",
        clientName: clientName,
        technologies: ["technologies"],
        role: "role",
        jobDescription: "jobDescription",
        status: true,
      },
      userId: "61d61fdc21adba3a0d9bbaf9",
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    adminCrudController.addOpening(req, res, () => {}).then((result) => {
      expect(result).to.have.property("projectName");
      done();
    });
  });

  it("should send a response with a valid position status for an existing position", function (done) {
    const req = {
      status: true
    };
    const res = {
      statusCode: 404,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      
    };
    userCrudController
      .getPosition(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
