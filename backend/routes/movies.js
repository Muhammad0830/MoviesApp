const moviesRouter = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../utils/middleware");

moviesRouter.get("/moviesDB", async (req, res) => {
  try {
    const Movies = await db.query(
      `Select id, title, description, image, movie_banner, original_title, original_title_romanised, director, producer, release_date, running_time, score, genre from movies;`
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
moviesRouter.get("/moviesDB/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "No id provided" });
    } else if (!Number.isInteger(Number(id))) {
      res.status(400).json({ message: "Invalid id" });
    }

    const Movie = await db.query(`Select * from movies where id = ${id};`);

    if (Movie[0].length > 0) {
      res.status(200).json({
        ...Movie[0][0],
        genre: Movie[0][0].genre.split(",").map((item) => item.trim()),
      });
    } else {
      res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

moviesRouter.post("/savedMovies", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const movie = await db.query(`Select * from movies where id = ${id};`);

    if (movie[0][0].length == 0) {
      return res.status(404).json({ message: "No movies found" });
    }

    const savedMoviesWithId = await db.query(
      `Select * from saved_movies where movie_id = ${id};`
    );

    if (savedMoviesWithId[0].length > 0) {
      return res.status(400).json({ message: "Movie already saved" });
    }

    const movieInsert = await db.query(
      "INSERT INTO saved_movies (movie_id) VALUES (:id)",
      {
        id: id,
      }
    );

    if (movieInsert) {
      return res.status(200).json({ message: "saved successfully" });
    } else {
      return res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

moviesRouter.get("/savedMovies", async (req, res) => {
  try {
    console.log('getting saved movies')
    const savedMovies = await db.query(`SELECT m.*
      FROM saved_movies sm
      JOIN movies m ON sm.movie_id = m.id
      ORDER BY sm.saved_at DESC;
    `);

    if (savedMovies[0].length > 0) {
      return res.status(200).json(savedMovies[0]);
    } else {
      return res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

moviesRouter.delete("/savedMovies/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const savedMovies = await db.query(
      `Select * from saved_movies where movie_id = ${id};`
    );

    if (savedMovies[0].length > 0) {
      await db.query(`Delete from saved_movies where movie_id = ${id};`);
      return res.status(200).json({ message: "deleted successfully" });
    } else {
      return res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

module.exports = moviesRouter;
