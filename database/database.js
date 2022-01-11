const Sequelize = require('sequelize')

const User = new Sequelize('projeto2', 'root', 'Senhaforte147*', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = User