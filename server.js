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

app
  .route("/articles")

  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post((req, res) => {
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
  })

  .delete((req, res) => {
    Article.deleteMany({}, err => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles");
      }
    });
  });

app.listen(process.env.PORT || 3000, () => {
  let port = process.env.PORT || 3000;
  console.log("Server started on port " + port);
});
