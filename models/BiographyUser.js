const Sequelize = require("sequelize")
const connection = require("../database/database")
const User = require("./User")

const BiographyUser = connection.define('Biographys', {
    biography: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

BiographyUser.belongsTo(User)

BiographyUser.sync({ force: false })

module.exports = BiographyUser