const Sequelize = require("sequelize");

const connection = new Sequelize("guia_press_blog", "root", "123456", {
	host: "localhost",
	port: "3306",
	dialect: "mysql",
	timezone: "-03:00",
});

module.exports = connection;
