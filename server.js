const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articlesSchema);

// const jackEntry = new Article({
//   title: "Jack Bauer",
//   content:
//     "Jack Bauer once stepped into quicksand. The quicksand couldn't escape and nearly drowned."
// });

// jackEntry.save();

app.get("/articles", (req, res) => {
  Article.find({}, (err, foundArticles) => {
    if (err) {
      res.send(err);
    } else {
      res.send(foundArticles);
    }
  });
});

app.post("/articles", (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(err => {
    if (err) {
      res.send(err);
    } else {
      res.send(
        "Successfully added a new article with the title " +
          "'" +
          newArticle.title +
          "'"
      );
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  let port = process.env.PORT || 3000;
  console.log("Server started on port " + port);
});
