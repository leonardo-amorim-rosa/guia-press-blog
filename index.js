const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

// Sessions
app.use(session({
	secret: "erefrtrtrt44343dfdfsdsds2222fg",
	cookie: { maxAge: 30000 }
}));

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
const User = require("./users/User");

// rotas
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

// EJS config
app.set("view engine", "ejs");

// Static files config
app.use(express.static("public"));

// Body parser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/sessions", (req, res) => {
	req.session.treinamento = "Formação Node JS";
	req.session.ano = 2024
	res.send("Session created!");
})

app.get("/sessions/read", (req, res) => {
	res.json({
		treinamento: req.session.treinamento,
		ano: req.session.ano
	});
});


app.get("/", (req, res) => {
	Article.findAll({
		order: [
			["id", "DESC"],
		],
		limit: 4
	}).then(articles => {
		Category.findAll().then(categories => {
			res.render("index", { articles: articles, categories: categories });
		});
	});
});

app.get("/:slug", (req, res) => {
	const slug = req.params.slug;
	Article.findOne({
		where: {
			slug: slug
		}
	}).then(article => {
		if (article != undefined) {
			Category.findAll().then(categories => {
				res.render("article", { article: article, categories: categories });
			});
		} else {
			res.redirect("/");
		}
	}).catch(error => {
		console.error(error);
		res.redirect("/");
	})
});

app.get("/category/:slug", (req, res) => {
	const slug = req.params.slug;
	Category.findOne({
		where: {
			slug: slug
		},
		include: [{ model: Article }]
	}).then(category => {
		if (category != undefined) {
			Category.findAll().then(categories => {
				res.render("index", { articles: category.articles, categories: categories });
			});
		} else {
			res.redirect("/");
		}
	}).catch(error => {
		console.error(error);
		res.redirect("/");
	})
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Servidor de pé na porta ${PORT}`);
});
