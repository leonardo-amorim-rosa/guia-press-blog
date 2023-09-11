const express = require("express");
const router = express.Router();
const User = require("./User");

router.get("/users/create", (req, res) => {
    res.send("Users form");
});

module.exports = router;