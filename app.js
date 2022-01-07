const express = require("express");
const mongoose = require("mongoose");

const passport = require("passport");

const errorController = require("./controllers/error");

const app = express();

const MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.pxg82.mongodb.net/iaquestion2";

//Pass variable into the configuration function
require("./config/passport")(passport);

//Initialize the passport object on every request
app.use(passport.initialize());

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.use(errorController.get404);

//Error handling middleware (when "return next(error)")
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
  res.end()
});

//DB Connetion
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    const error = new Error("Could not connect to database ");
    error.statusCode = 502;
    throw error;
  });
