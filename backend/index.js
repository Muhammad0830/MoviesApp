const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config();
const db = require("./db");

const app = express();

app.use(express.json());

const URL = process.env.MOVIES_URL;

let data;
axios.get(URL).then((res) => (data = res.data));

app.get("/", (req, res) => {
  res.send(`<h1>Hello World!</h1>`);
});

app.get("/movies", (req, res) => {
  res.json(data);
});

app.get('/moviesDB', async (req, res) => {
  try {
    const Movies = await db.query(`Select id, title, description, image, movie_banner, original_title, original_title_romanised, director, producer, release_date, running_time, score from movies;`);
    if(Movies){
      res.status(200).json(Movies[0])
    } else {
      res.status(404).json({ message: "No movies found" })
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})

// inserting initial movies to the database
// app.get("/insert_first_movies", async (req, res) => {
//   try {
//     const response = await axios.get(URL);
//     const movies = response.data;

//     for (const movie of movies) {
//         const movie_insert = await db.execute(
//           `
//                   INSERT INTO movies (
//                       title, description, movie_id, image,
//                       movie_banner, original_title, original_title_romanised,
//                       director, producer, release_date, running_time, score)
//                   VALUE (:title, :description, :movie_id, :image, :movie_banner,
//                       :original_title, :original_title_romanised, :director,
//                       :producer, :release_date, :running_time, :score);`,
//           {
//             title: movie.title,
//             description: movie.description,
//             movie_id: movie.id,
//             image: movie.image,
//             movie_banner: movie.movie_banner,
//             original_title: movie.original_title,
//             original_title_romanised: movie.original_title_romanised,
//             director: movie.director,
//             producer: movie.producer,
//             release_date: movie.release_date,
//             running_time: movie.running_time,
//             score: movie.rt_score,
//           }
//         );
//     }

//     res.status(200).send({ message: "Data inserted successfully" });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
