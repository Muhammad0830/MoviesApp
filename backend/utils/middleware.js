const logger = require("./logger");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('authHeader', authHeader)
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  console.log('token', token)
  console.log(process.env.JWT_SECRET_CODE)
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_CODE);
    req.user = user;
    next();
  } catch (err) {
    console.error('error', err.message)
    res.sendStatus(403);
  }
};

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

module.exports = { unknownEnpoint, errorHandler, notFound, authenticate };
