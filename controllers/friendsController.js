const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Friends = require('../models/Friends')
const userLogin = require("../middlewares/userLogin")

router.get("/user/friends", userLogin, (req, res) => {

    res.render("user/friends/friends")

})

router.get("/user/sent", userLogin, (req, res) => {

    Friends.findAll({
        where: {
            answer: "P",
            idSender: req.session.user.id
        },
    }).then((friends) => {
        User.findAll({
        }).then((users) => {
            res.render("user/friends/sent", { friends: friends, users: users })
        }).catch((err) => {
            console.log(err)
        })
    })
})

router.get("/user/pending", userLogin, (req, res) => {

    Friends.findAll({
        where: {
            answer: "P",
            idSender: req.session.user.id
        },
    }).then((friends) => {
        User.findAll({
        }).then((users) => {
            res.render("user/friends/pending", { friends: friends, users: users })
        }).catch((err) => {
            console.log(err)
        })
    })
})

router.post("/user/request", userLogin, (req, res) => {
    let { id } = req.body

    id = parseFloat(id)

    Friends.findOne({
        where: {
            idSender: req.session.user.id,
            idRecipient: id
        }
    }).then((user) => {
        if (user == undefined) {

            Friends.create({
                idRecipient: id,
                idSender: req.session.user.id,
                answer: "P"
            }).then(() => {
                res.redirect("/user/index")
            }).catch((err) => {
                console.log(err)
                res.json(err)
                //res.redirect("/user/profile")
                console.log(id)
                console.log(req.session.user.id)
            })

        }
        else {
            //res.redirect("/user/index")
        }
    }).catch(() => {
        //res.redirect("/user/index")
    })
})


module.exports = router