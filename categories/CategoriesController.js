const express = require("express");
const router = express.Router();
const slugigy = require("slugify");

const Category = require("./Category");

router.get("/admin/categories", (req, res) => {
	Category.findAll({ raw: true }).then((categories) => {
		console.log('CATEGORIAS================');
		categories = categories.map(item => {
			return {
				id: item.id,
				title: item.title,
				slug: item.slug.toLowerCase(),
				createdAt: item.createdAt,
				updatedAt: item.updatedAt
			}
		});

		categories.forEach(c => console.log(c));

		res.render("admin/categories/index", { categories });
	});
});

router.get("/admin/categories/new", (req, res) => {
	res.render("admin/categories/new");
});

router.post("/admin/categories/save", (req, res) => {
	let title = req.body.title;

	if (title != undefined) {
		Category.create({
			title: title,
			slug: slugigy(title),
		}).then(result => {
			res.redirect("/admin/categories");
		}).catch(error => {
			console.error(error);
			res.redirect("/admin/categories");
		});
	} else {
		res.redirect("/admin/categories");
	}
});

router.post("/admin/categories/delete", (req, res) => {
	let id = req.body.id;

	if (id != undefined) {
		if (!isNaN(id)) {
			Category.destroy({ where: { id: id } }).then(() => {
				res.redirect("/admin/categories");
			});
		} else {
			res.redirect("/admin/categories");
		}
	} else {
		res.redirect("/admin/categories");
	}
});

router.get("/admin/categories/edit/:id", (req, res) => {
	const id = req.params.id;

	if (isNaN(id)) {
		res.redirect("/admin/categories");
	}

	Category.findByPk(id).then(category => {
		if (category != undefined) {
			res.render("admin/categories/edit", { category: category });
		} else {
			res.redirect("/admin/categories");
		}
	}).catch(error => {
		console.error(error);
		res.redirect("/admin/categories");
	});
});

router.post("/admin/categories/update", (req, res) => {
	let id = req.body.id;
	let title = req.body.title;

	if (title != undefined && id != undefined) {
		Category.update({
			title: title,
			slug: slugigy(title),
		}, {
			where: {
				id: id
			}
		}).then(result => {
			res.redirect("/admin/categories");
		}).catch(error => {
			console.error(error);
			res.redirect("/admin/categories");
		});

	} else {
		res.redirect("/admin/categories");
	}
});

module.exports = router;
