const http = require("http");
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

const URL = process.env.URL;

let data;
axios.get(URL).then((res) => (data = res.data));

app.get("/", (req, res) => {
  res.send(`<h1>Hello World!</h1>`);
});

app.get("/movies", (req, res) => {
  res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
