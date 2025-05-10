const logger = require("./logger");

const unknownEnpoint = (req, res, next) => {
  logger.error(`Unknown endpoint ${req.originalUrl}`);
  res.status(404).json({ message: "Unknown endpoint" });
};

const notFound = (req, res, next) => {
  logger.error(`Not found ${req.originalUrl}`);
  res.status(404).json({ message: "Not found" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  if(err.name == "CastError") {
    return res.status(400).send({ err : "malformatted Id"})
  } else if(err.name == "ValidationError") {
    return res.status(400).send({ err : "malformatted Id"})
  } 

  next(err)
};

module.exports = { unknownEnpoint, errorHandler, notFound };
