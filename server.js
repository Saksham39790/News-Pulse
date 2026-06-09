const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));

const API_KEY = process.env.GNEWS_API_KEY;

app.get("/news", async (req, res) => {
    try {
        const search = req.query.search || "india";
        const page = req.query.page || 1;

        const response = await fetch(
        `https://gnews.io/api/v4/search?q=${search}&lang=en&max=20&apikey=2e772ce90279db0751ddca2877396962`
        );

        const data = await response.json();

        console.log("Search:", search);
        console.log("Results:", data.totalResults);
        console.log("Articles returned:", data.articles.length);
        console.log("First article:", data.articles[0]);

        const formattedArticles = data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.publishedAt || article.published_at,
            source: {
                name: article.source.name
            }
        }));

res.json({
    articles: formattedArticles
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch news"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});