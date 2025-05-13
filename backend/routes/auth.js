const bcrypt = require("bcrypt");
const db = require("../db");
const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");

console.log('auth router')

authRouter.get('/test', async (req, res) => {
  console.log('test')
  res.status(200).json({ message: 'test' })
})

authRouter.post("/signup", async (req, res) => {
  console.log('sign up')
  console.log('req.body', req.body)
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET_CODE, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: { id: userId, email, username } });
  } catch (err) {
    console.log('error.message', err.message)
    res.status(500).json({ error: "Email might already be used" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const user = rows[0];

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET_CODE,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = authRouter;
