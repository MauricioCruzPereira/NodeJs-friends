const express = require("express")
const router = express.Router()
const User = require("../models/User")
const BiographyUser = require("../models/BiographyUser")
const adminlogin = require("../middlewares/adminLogin")

router.get("/admin", adminlogin, (req, res) => {
    res.render("admin/index")
})

router.get("/admin/users", adminlogin, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users", { users: users })
    })
})

router.get("/admin/user/:id", adminlogin, (req, res) => {
    let { id } = req.params

    if (id != null) {
        if (!isNaN(id)) {
            BiographyUser.destroy({
                where: {
                    userId: id
                }
            }).then(() => {
                User.destroy({
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.redirect("/admin/users")
                })
            })
        }
        else {
            res.redirect("/admin/users")
        }
    } else {
        res.redirect("/admin/users")
    }

})


module.exports = router