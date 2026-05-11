const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// API Kinopoisk
const API_KEY = "94632335-dcd2-4f44-98d5-18866651d7d4";

// простой кеш (чтобы не спамить API)
const cache = new Map();

app.get("/", (req, res) => {
    res.send("Movie Proxy Server is running");
});

app.get("/movies", async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (!keyword) {
            return res.status(400).json({
                error: "keyword is required",
                films: []
            });
        }

        // cache check
        if (cache.has(keyword)) {
            return res.json(cache.get(keyword));
        }

        const response = await axios.get(
            "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword",
            {
                params: {
                    keyword: keyword,
                    page: 1
                },
                headers: {
                    "X-API-KEY": API_KEY
                },
                timeout: 10000
            }
        );

        const result = {
            keyword: keyword,
            films: response.data.films || []
        };

        cache.set(keyword, result);

        res.json(result);

    } catch (error) {
        console.log("ERROR:", error.message);

        res.status(500).json({
            error: "server error",
            films: []
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});