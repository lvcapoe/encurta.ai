const Sequelize = require('sequelize');

const connection = new Sequelize('yourdatabase', 'youruser', 'yourpassword', {
	host:'localhost',
	dialect: 'mysql',
	timezone: "-03:00"
});


module.exports = connection;