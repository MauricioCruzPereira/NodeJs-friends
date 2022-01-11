const Sequelize = require("sequelize")
const connection = require("../database/database")
const User = require("./User")

const Friends = connection.define('Friends', {
    idSender: {
        type: Sequelize.NUMBER,
        alloNull: false,
    },
    idRecipient: {
        type: Sequelize.NUMBER,
        alloNull: false,
    }
})

Friends.sync({ force: false })

module.exports = Friends