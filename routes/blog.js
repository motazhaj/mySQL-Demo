const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", (req, res) => {
  res.render("posts-list");
});

router.get("/new-post", async (req, res) => {
  const [authors] = await db.query("SELECT * FROM blog.authors");
  res.render("create-post", { authors: authors });
});

router.post("/posts", async (req, res) => {
  const data = [req.body.title, req.body.content, req.body.author];
  await db.query("INSERT INTO posts (title,body,author_id) VALUES (?)", [data]);
  res.redirect("/posts");
});

module.exports = router;
