//config
const config = require("./config/config.json");

//libraries
const express = require("express");

//express environment
const port = 1026;
const app = express();

//express settings
app.set("view engine", "ejs");
app.set("views", __dirname + "\\views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "\\public"));

app.get("/", (req, res) => {
  res.render("index", { api: config.project.api, front: config.project.front });
});

app.get("/main", (req, res) => {
  res.render("main", { api: config.project.api, front: config.project.front });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
