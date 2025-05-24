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
    const { movieId, userId } = req.body;
    console.log("svaing a movie to the user...");

    if (!movieId || !userId) {
      return res.status(400).json({ error: "id is required" });
    }

    const movie = await db.query(`Select * from movies where id = ${movieId};`);

    if (movie[0][0].length == 0) {
      return res.status(404).json({ message: "No movies found" });
    }

    const savedMoviesWithId = await db.query(
      `Select * from saved_movies where movie_id = ${movieId} and user_id = ${userId};`
    );

    if (savedMoviesWithId[0].length > 0) {
      return res.status(400).json({ message: "Movie already saved" });
    }

    const movieInsert = await db.query(
      "INSERT INTO saved_movies (movie_id, user_id) VALUES (:movieId, :userId)",
      {
        movieId: movieId,
        userId: userId,
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

moviesRouter.get("/savedMovies/:id", async (req, res) => {
  try {
    console.log("getting saved movies");
    const id = req.params.id;

    const savedMovies =
      await db.query(`select sm.id, sm.movie_id, us.username, m.*
                        from saved_movies as sm
                        join movies as m on sm.movie_id = m.id
	                      join users as us On sm.user_id = us.id
                        where sm.user_id = ${id};`);

    if (savedMovies[0].length > 0) {
      return res.status(200).json(savedMovies[0]);
    } else {
      return res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

// filtering for search page
moviesRouter.get("/moviesSearch", async (req, res) => {
  try {
    // 1️⃣ Read query params (with defaults)
    const {
      search = "",
      sortBy = "id",
      order = "DESC",
      genre = "",
      limit = 10,
      page = 1,
      minRating = 0, // 👈 NEW
      minViews = 0, // 👈 OPTIONAL
      minFavorites = 0, // 👈 OPTIONAL
    } = req.query;
    console.log('sortBy', sortBy)

    const offset = (page - 1) * limit;
    console.log("page", page);
    console.log("limit", limit);
    console.log("offset", offset);

    let sql = `SELECT * FROM movies WHERE 1`;
    const params = [];

    if (search) {
      sql += ` AND LOWER(title) LIKE ?`;
      params.push(`%${search.toLowerCase()}%`);
    }

    if (genre) {
      sql += ` AND genre = ?`;
      params.push(genre);
    }

    if (Number(minRating)) {
      sql += ` AND score >= ?`;
      params.push(Number(minRating));
    }

    if (Number(minViews)) {
      console.log('min Views working', typeof minViews)
      sql += ` AND views >= ?`;
      params.push(Number(minViews));
    }

    if (Number(minFavorites)) {
      sql += ` AND favorites >= ?`;
      params.push(Number(minFavorites));
    }

    // Sorting and pagination (same as before)
    const allowedSortColumns = ["score", "views", "favorites", "scoret", "id"];
    if (!allowedSortColumns.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sortBy field." });
    }
    const dir = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
    sql += ` ORDER BY \`${sortBy}\` ${dir}`;

    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    // 7️⃣ Execute
    const [movies] = await db.query(sql, params);
    res.json({ movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

moviesRouter.delete("/savedMovies/:movieId/users/:userId", async (req, res) => {
  try {
    console.log("deleting a saved movie...");
    const { movieId, userId } = req.params;

    if (!movieId || !userId) {
      return res.status(400).json({ error: "id is required" });
    }

    const savedMovies = await db.query(
      `Select * from saved_movies where movie_id = ${movieId} and user_id = ${userId};`
    );
    if (savedMovies[0].length > 0) {
      await db.query(
        `Delete from saved_movies where movie_id = ${movieId} and user_id = ${userId};`
      );
      return res.status(200).json({ message: "deleted successfully" });
    } else {
      return res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

module.exports = moviesRouter;
