const Sequelize = require("sequelize")
const connection = require("../database/database")

const Friends = connection.define('friends', {
    idSender: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    idRecipient: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    answer: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//Friends.sync({ force: true })

module.exports = Friends

