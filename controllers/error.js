exports.get404 = (req, res, next) => {
  const error = new Error("Page not found");
  error.statusCode = 404;
  throw error;
};
