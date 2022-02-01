const Sequelize = require('sequelize')
//variaveis de ambiente
require('dotenv').config()
const User = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = User