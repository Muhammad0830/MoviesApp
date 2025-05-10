const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db");
const cors = require("cors");
const app = express();
const moviesRouter = require("./controllers/movies");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(express.json());

app.use('/', moviesRouter);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app