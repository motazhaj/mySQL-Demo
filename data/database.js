const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "blog",
  user: "root",
  password: "T#5q2Wx@9zP",
});

module.exports = pool;
