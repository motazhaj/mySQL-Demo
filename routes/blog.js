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

router.get("/posts/:id", async (req, res) => {
  const dbQuery = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
    INNER JOIN authors on posts.author_id = authors.id
    WHERE posts.id = ?
  `;

  const [posts] = await db.query(dbQuery, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    formatDate: posts[0].date.toLocaleDateString("default", {
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  res.render("post-detail", { post: postData });
});

router.get("/posts/:id/edit", async (req, res) => {
  const dbQuery = `
    SELECT posts.*, authors.name AS author_name FROM posts
    INNER JOIN authors on posts.author_id = authors.id
    WHERE posts.id = ?
  `;
  const [posts] = await db.query(dbQuery, [req.params.id]);

  const [authors] = await db.query("SELECT * FROM blog.authors");

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  res.render("update-post", { post: posts[0], authors: authors });
});

router.post("/posts/:id/edit", async (req, res) => {
  const dbQuery = `
    UPDATE posts SET title = ?, body = ?, author_id = ?
    WHERE id = ?
  `;
  const postData = [
    req.body.title,
    req.body.content,
    req.body.author,
    req.params.id,
  ];
  await db.query(dbQuery, postData);

  res.redirect("/posts/" + req.params.id);
});

router.post("/posts/:id/delete", async (req, res) => {
  await db.query(`DELETE FROM posts WHERE id = ?`, [req.params.id]);

  res.redirect("/posts");
});

module.exports = router;
