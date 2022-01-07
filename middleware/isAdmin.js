exports.isAdmin = (req, res, next) => {
  if (req.user.role === "project manager") {
    next();
  } else {
    const error = new Error("Unauthorize not admin");
    error.statusCode = 501;
    throw error;
  }
};
