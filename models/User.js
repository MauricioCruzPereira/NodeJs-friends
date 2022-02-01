const Sequelize = require('sequelize')
const connection = require('../database/database')

const User = connection.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    profession: {
        type: Sequelize.STRING,
        allowNull: true
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    },
    admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

//User.sync({ force: true })

module.exports = User