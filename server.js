const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));

const API_KEY = "decf1134dac7472da25a139dda23a861";

app.get("/news", async (req, res) => {
    try {
        const search = req.query.search || "india";
        const page = req.query.page || 1;

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${search}&sortBy=publishedAt&pageSize=20&page=${page}&apiKey=${API_KEY}`
        );

        const data = await response.json();

        console.log("Search:", search);
        console.log("Results:", data.totalResults);

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch news"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});