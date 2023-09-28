const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "0526", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
