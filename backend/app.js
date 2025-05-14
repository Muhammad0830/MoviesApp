const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db");
const cors = require("cors");
const app = express();
const moviesRouter = require("./routes/movies");
const authRouter = require("./routes/auth");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const userRouter = require("./routes/user");

app.use(cors());
app.use(express.json());

app.use('/movies/', moviesRouter);
app.use('/auth/', authRouter);
app.use('/users/', userRouter);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app