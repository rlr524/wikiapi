const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const Schema = mongoose.Schema;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const articlesSchema = new Schema(
  {
    url: String,
    title: String,
    content: String,
    deleted: Boolean
  },
  { timestamps: true }
);

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
      url: _.kebabCase(req.body.title),
      title: req.body.title,
      content: req.body.content,
      deleted: false
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
    Article.updateMany({}, { $set: { deleted: true } }, err => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleUrl")

  .get((req, res) => {
    const articleUrl = _.kebabCase(req.params.articleUrl);
    Article.findOne({ url: articleUrl }, (err, foundArticle) => {
      if (err) {
        res.send(err);
      } else if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article matching that title was found.");
      }
    });
  })

  .put((req, res) => {
    Article.updateOne(
      { url: req.params.articleUrl },
      {
        $set: {
          url: _.kebabCase(req.body.title),
          title: req.body.title,
          content: req.body.content,
          deleted: false
        }
      },
      err => {
        if (!err) {
          res.send("Successfully updated.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Article.updateOne(
      { url: req.params.articleUrl },
      { $set: req.body },
      err => {
        if (!err) {
          res.send("Successfully updated.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete((req, res) => {
    Article.updateOne(
      { url: req.params.articleUrl },
      { $set: { deleted: true } },
      err => {
        if (!err) {
          res.send("Successfully deleted.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(process.env.PORT || 3000, () => {
  let port = process.env.PORT || 3000;
  console.log("Server started on port " + port);
});
