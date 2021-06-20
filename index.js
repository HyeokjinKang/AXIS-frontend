//config
const config = require("./config/config.json");

//libraries
const express = require("express");
const cookieParser = require("cookie-parser");
const i18n = require("./i18n");

//express environment
const port = 1026;
const app = express();
app.locals.pretty = true;

//express settings
app.set("view engine", "ejs");
app.set("views", __dirname + "\\views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "\\public"));
app.use(cookieParser());
app.use(i18n);

app.get("/en", (req, res) => {
  res.cookie("lang", "en");
  res.redirect("/main");
});

app.get("/ko", (req, res) => {
  res.cookie("lang", "ko");
  res.redirect("/main");
});

app.get("/cn", (req, res) => {
  res.cookie("lang", "cn");
  res.redirect("/main");
});

app.get("/jp", (req, res) => {
  res.cookie("lang", "jp");
  res.redirect("/main");
});

app.get("/", (req, res) => {
  res.render("index", { api: config.project.api, front: config.project.front });
});

app.get("/main", (req, res) => {
  res.render("main", { api: config.project.api, front: config.project.front });
});

app.get("/success", (req, res) => {
  res.render("success", {
    api: config.project.api,
    front: config.project.front,
  });
});

app.get("/fail", (req, res) => {
  res.render("fail", { api: config.project.api, front: config.project.front });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
