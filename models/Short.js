const Sequelize = require('sequelize');
const connection = require('../database/database.js')

const Short = connection.define('shorts', {
	shortlink:{
		type: Sequelize.STRING,
		allowNull: false
	},
	originallink:{
		type: Sequelize.STRING,
		allowNull: false
	}
});

//Short.sync({ force: true });
module.exports = Short;