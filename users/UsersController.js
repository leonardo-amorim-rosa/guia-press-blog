const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll({
        order: [
            ['id', 'DESC']
        ],
    }).then(users => {
        res.render("admin/users/index", { users: users });
    })
});

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create");
});

router.post("/admin/users/create", adminAuth, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            User.create({ email: email, password: hash }).then(() => {
                res.redirect("/admin/users");
            }).catch(err => {
                res.redirect("/");
            });

        } else {
            res.redirect("/admin/users/create");
        }

    }).catch(err => {
        res.redirect("/");
    });

});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
})

router.get("/logout", (req, res) => {
    delete req.session.user;
    res.redirect("/");
});

router.post("/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            let correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                };
                res.redirect("/admin/users");
            } else {
                res.redirect("/login");
            }

        } else {
            res.redirect("/login");
        }
    }).catch(err => {
        res.redirect("/login");
    })
});

module.exports = router;