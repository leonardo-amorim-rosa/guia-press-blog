const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const connection = require("./database/database");

// Database connection
connection
	.authenticate()
	.then(() => {
		console.log("Conexão realizada com sucesso!");
	})
	.catch((err) => {
		console.error(err);
	});

// models
const Category = require("./categories/Category");
const Article = require("./articles/Article");

// rotas
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

// EJS config
app.set("view engine", "ejs");

// Static files config
app.use(express.static("public"));

// Body parser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
	res.render("index");
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Servidor de pé na porta ${PORT}`);
});
