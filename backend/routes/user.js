const userRouter = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../utils/middleware");

userRouter.get("/user", async (req, res) => {
  console.log("getting a user");
  try {
    const user = await db.query(
      `Select * from users;`
    );
    console.log("user", user[0]);
    if (user[0].length > 0) {
      res.status(200).json(user[0][0]);
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = userRouter;
