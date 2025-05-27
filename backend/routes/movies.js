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

    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM movies WHERE 1`;
    let paginateSql = `SELECT COUNT(*) as count FROM movies WHERE 1`;
    const params = [];

    if (search) {
      sql += ` AND LOWER(title) LIKE ?`;
      paginateSql += ` AND LOWER(title) LIKE ?`;
      params.push(`%${search.toLowerCase()}%`);
    }

    if (genre) {
      sql += ` AND genre = ?`;
      paginateSql += ` AND genre = ?`;
      params.push(genre);
    }

    if (Number(minRating)) {
      sql += ` AND score >= ?`;
      paginateSql += ` AND score >= ?`;
      params.push(Number(minRating));
    }

    if (Number(minViews)) {
      sql += ` AND views >= ?`;
      paginateSql += ` AND views >= ?`;
      params.push(Number(minViews));
    }

    if (Number(minFavorites)) {
      sql += ` AND favorites >= ?`;
      paginateSql += ` AND favorites >= ?`;
      params.push(Number(minFavorites));
    }

    // Sorting and pagination (same as before)
    const allowedSortColumns = ["score", "views", "favorites", "scoret", "id"];
    if (!allowedSortColumns.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sortBy field." });
    }
    const dir = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
    sql += ` ORDER BY \`${sortBy}\` ${dir}`;
    paginateSql += ` ORDER BY \`${sortBy}\` ${dir}`;

    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    // 7️⃣ Execute
    const [movies] = await db.query(sql, params);
    const [moviesLength] = await db.query(paginateSql, params);
    const pagination = { page, limit, offset, total: moviesLength[0].count };
    res.json({ movies, pagination });
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

moviesRouter.post("/rate", async (req, res) => {
  try {
    console.log("rating a movie...");
    const { movieId, userId, rate } = req.body;
    console.log("movieId", movieId);
    console.log("userId", userId);
    console.log("rate", rate);

    if (!movieId || !userId) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!rate) {
      return res.status(400).json({ error: "rate is required" });
    }

    const rating = await db.query(
      `INSERT INTO ratings (user_id, movie_id, score)
            VALUES (:userId, :movieId, :score)
            ON DUPLICATE KEY UPDATE score = VALUES(score);`,
      {
        userId: userId,
        movieId: movieId,
        score: rate,
      }
    );

    const [averageScore] = await db.query(`SELECT AVG(score) AS average_score
            FROM ratings
            WHERE movie_id = ${movieId};`);

    console.log("averageScore", averageScore[0].average_score);

    const updateMovieScore = await db.query(`UPDATE movies
            SET score = ${averageScore[0].average_score}
            WHERE id = ${movieId};`);
  } catch (err) {
    console.error({ error: err.message });
  }
});

moviesRouter.get("/ratedMovie/:movieId/users/:userId", async (req, res) => {
  try {
    console.log("getting a ratings ...");
    const { movieId, userId } = req.params;

    console.log("movieId", movieId);
    console.log("userId", userId);

    if (!movieId || !userId) {
      return res.status(400).json({ error: "id is required" });
    }

    const [ratings] = await db.query(
      `SELECT * FROM ratings WHERE movie_id = ${movieId} AND user_id = ${userId};`
    );

    console.log("ratings", ratings[0]);
    return res.status(200).json(ratings[0]);
    if (ratings.length > 0) {
    } else {
      return res.status(200).json({});
    }
  } catch (err) {
    console.log("error");
    console.error({ error: err.message });
  }
});

module.exports = moviesRouter;
