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

app.get('/practice', async (req, res) => {
    try{
        const movie_insert = await db.execute(`
            INSERT INTO movies (name, description, movie_id, image, movie_banner) 
            VALUE (:name, :description, :movie_id, :image, :movie_banner);`,
            {
                name: 'Practice',
                description: 'Practice description',
                movie_id: 1,
                image: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
                movie_banner: 'https://image.tmdb.org/t/p/original/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg'
            })
        
        res.status(200).json({
            movie: {
                name: 'Practice',
                description: 'Practice description',
                movie_id: 1,
                image: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
                movie_banner: 'https://image.tmdb.org/t/p/original/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg'
            }
        })
    } catch(err) {
        res.status(500).send({"error": err.message})
    }
})

app.get('/init_countries', async (req, res) => {
    try{
        const response = await axios.get(URL)
        const countries = response.data

    } catch(err){
        res.status(500).send({"error": err.message})
    }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
