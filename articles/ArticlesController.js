const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
	Article.findAll({
		include: [{ model: Category }]
	}).then(articles => {
		res.render("admin/articles/index", { articles: articles });
	});
});

router.get("/admin/articles/new", (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/articles/new", { categories: categories });
	});
});

router.post("/admin/articles/save", (req, res) => {
	const title = req.body.title;
	const body = req.body.article;
	const category = req.body.category;

	Article.create({
		title: title,
		body: body,
		slug: slugify(title),
		categoryId: category
	}).then(() => {
		res.redirect("/admin/articles");
	})
})

router.post("/admin/articles/delete", (req, res) => {
	const id = req.body.id;

	if (id != undefined) {
		if (!isNaN(id)) {
			Article.destroy({ where: { id: id } }).then(() => {
				res.redirect("/admin/articles");
			});
		} else {
			res.redirect("/admin/articles");
		}
	} else {
		res.redirect("/admin/articles");
	}
});

router.get("/admin/articles/edit/:id", (req, res) => {
	const id = req.params.id;

	if (isNaN(id)) {
		res.redirect("/admin/articles");
	}

	Article.findByPk(id).then(article => {
		if (article != undefined) {
			Category.findAll().then(categories => {
				res.render("admin/articles/edit", { article: article, categories: categories });
			});
		} else {
			res.redirect("/admin/articles");
		}
	}).catch(error => {
		console.error(error);
		res.redirect("/admin/articles");
	});
});

router.post("/admin/articles/update", (req, res) => {
	const id = req.body.id;
	const title = req.body.title;
	const body = req.body.article;
	const category = req.body.category;

	Article.update({ title: title, body: body, categoryId: category, slug: slugify(title) },
		{
			where: {
				id: id
			}
		}).then(() => {
			res.redirect("/admin/articles");
		}).catch(error => {
			console.error(error);
			res.redirect("/");
		});
})

router.get("/admin/articles/page/:num", (req, res) => {
	const page = req.params.num;
	let offset = 0;
	let limit = 4;

	if (isNaN(page) || page == 1) {
		offset = 0;
	} else {
		offset = (parseInt(page) - 1) * limit;
	}

	Article.findAndCountAll({
		order: [
			["id", "DESC"],
		],
		limit: limit,
		offset: offset
	}).then(articles => {

		let next = false;
		if ((offset + limit) >= articles.count) {
			next = false;
		} else {
			next = true;
		}

		let result = {
			page: parseInt(page),
			next: next,
			articles: articles
		};
		console.log(result);

		Category.findAll().then(categories => {
			res.render("admin/articles/page", { result: result, categories: categories });
		});
	});

});

module.exports = router;
