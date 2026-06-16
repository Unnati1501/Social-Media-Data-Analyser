const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const AppSearch = require("./models/AppSearch");

const app = express();
const { default: gplay } = require("google-play-scraper");

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://unnati4743_db_user:Unnati1236@cluster0.4fmpa7g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected");
});

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Working");
});

// Search App Route
app.get("/app/:name", async (req, res) => {
  try {
    const results = await gplay.search({
      term: req.params.name,
      num: 1,
    });

    const appInfo = await gplay.app({
  appId: results[0].appId,
});

console.log(appInfo);

    // Fetch reviews
    const reviews = await gplay.reviews({
  appId: appInfo.appId,
  sort: gplay.sort.NEWEST,
  num: 50,
});

const reviewTexts = reviews.data.map(
  (review) => review.text
);

    // PASTE THE SENTIMENT CODE HERE
    const Sentiment = require("sentiment");
    const sentiment = new Sentiment();

    let positive = 0;
    let negative = 0;

    reviews.data.forEach((review) => {
      const score = sentiment.analyze(review.text).score;

      if (score > 0) positive++;
      else if (score < 0) negative++;
    });

    // Return data
   res.json({
  name: appInfo.title,

  rating: appInfo.score,

  downloads: appInfo.installs,

  reviews: appInfo.reviews,

  sampleReviews: reviewTexts.slice(0, 10),

  ratings: [
    { stars: "5★", count: appInfo.histogram["5"] },
    { stars: "4★", count: appInfo.histogram["4"] },
    { stars: "3★", count: appInfo.histogram["3"] },
    { stars: "2★", count: appInfo.histogram["2"] },
    { stars: "1★", count: appInfo.histogram["1"] },
  ],

  sentiment: [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
  ],

  keywords: [
    "Performance",
    "UI",
    "Features",
    "Ads",
    "Updates",
  ],

  insights: [
    `App rating is ${appInfo.score}`,
    `Total reviews: ${appInfo.reviews}`,
    `Downloads exceed ${appInfo.installs}`,
  ],

  competitors: [
    {
      name: "TikTok",
      rating: 4.4,
      downloads: "1B+",
    },
    {
      name: "Snapchat",
      rating: 4.2,
      downloads: "500M+",
    },
    {
      name: "Facebook",
      rating: 4.1,
      downloads: "5B+",
    },
  ],
});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching app data",
    });
  }
});

app.get("/compare/:app1/:app2", async (req, res) => {
  try {
    const app1Results = await gplay.search({
      term: req.params.app1,
      num: 1,
    });

    const app2Results = await gplay.search({
      term: req.params.app2,
      num: 1,
    });

    const app1 = app1Results[0];
    const app2 = app2Results[0];

    res.json({
      app1: {
        name: app1.title,
        rating: app1.score,
        downloads: app1.installs,
      },
      app2: {
        name: app2.title,
        rating: app2.score,
        downloads: app2.installs,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Comparison failed",
    });
  }
});

app.get("/trending", async (req, res) => {
  try {
    const trending = await AppSearch.aggregate([
      {
        $group: {
          _id: "$appName",
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    res.json(trending);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching trending apps"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});