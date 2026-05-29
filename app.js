const express = require("express");
const app = express();

const config = require("./config.json");

//== connect to database
const mongoURI =
  config.MONGODB_URI || "mongodb://localhost:27017" + "/newsFeed";

let mongoose = require("mongoose");
const newsArticleModel = require("./model");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

// your code here!
app.get("/newsFeeds", async (req, res) => {
  try {
    let limitAmount = parseInt(req.query.limit);
    let offsetAmount = parseInt(req.query.offset);

    if (isNaN(limitAmount) || limitAmount < 0) { // if limit is not a valid number or negative, set it to default
      limitAmount = 10; // default value
    }
    if (isNaN(offsetAmount) || offsetAmount < 0) {
      offsetAmount = 0; // default value
    }

    const news = await newsArticleModel
    .find()
    .skip(offsetAmount)
    .limit(limitAmount);

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news feeds" });
  }
});


// ==end==

module.exports = { app, db };
