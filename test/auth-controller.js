const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function() {
  before(function(done) {
    mongoose
      .connect(
        'mongodb+srv://admin:admin@cluster0.pxg82.mongodb.net/iaquestion2'
      )
      .then(result => {
        const user = new User({
          name: "user3",
          userName: "userName3",
          password: "user3",
          role: "user",
          _id: '61d765391ccbbd9fe813274f'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('should throw an error with code 500 if accessing the database fails', function(done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        userName: 'userName',
        password: 'userName'
      }
    };

    AuthController.loginUser(req, {}, () => {}).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });

  

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
