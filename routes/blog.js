const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  const dbQuery = `
  SELECT posts.*, authors.name AS author_name FROM blog.posts 
  INNER JOIN blog.authors ON posts.author_id = authors.id
  `;
  const [posts] = await db.query(dbQuery);

  console.log(posts);
  res.render("posts-list", { posts: posts });
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
