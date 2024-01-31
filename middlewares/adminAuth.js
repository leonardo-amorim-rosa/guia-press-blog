function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = adminAuth;