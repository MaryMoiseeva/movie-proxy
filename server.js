const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const API_KEY = "94632335-dcd2-4f44-98d5-18866651d7d4";

app.get("/movies", async (req, res) => {
    try {
        const keyword = req.query.keyword;

        const response = await axios.get(
            "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword",
            {
                params: {
                    keyword: keyword,
                    page: 1
                },
                headers: {
                    "X-API-KEY": API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            error: "Server error"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});