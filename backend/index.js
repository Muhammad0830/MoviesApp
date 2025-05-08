const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db");

const app = express();

app.use(express.json());

// to get list of movies
app.get("/moviesDB", async (req, res) => {
  try {
    console.log('working')
    const Movies = await db.query(
      `Select id, title, description, image, movie_banner, original_title, original_title_romanised, director, producer, release_date, running_time, score from movies;`
    );
    if (Movies) {
      res.status(200).json(Movies[0]);
    } else {
      res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// to get each movie
app.get("/moviesDB/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id', id)

    if (!id) {
      res.status(400).json({ message: "No id provided" });
    } else if (!Number.isInteger(Number(id))) {
      res.status(400).json({ message: "Invalid id" });
    }

    const Movie = await db.query(`Select * from movies where id = ${id};`);
    console.log('Movie', Movie[0])

    if (Movie[0].length > 0) {
      res.status(200).json(Movie[0]);
    } else {
      res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
