const Sequelize = require("sequelize")
const connection = require("../database/database")
const User = require("./User")

const BiographyUser = connection.define('biographys', {
    biography: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

BiographyUser.belongsTo(User)

// BiographyUser.sync({ force: true })

module.exports = BiographyUser