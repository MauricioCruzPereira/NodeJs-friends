const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Friends = require('../models/Friends')
const userLogin = require("../middlewares/userLogin")
const { route } = require('express/lib/application')

router.get("/user/friends", userLogin, (req, res) => {

    Friends.findAll({
        where: {
            answer: "A",
            idSender: req.session.user.id
        },
    }).then((friends) => {
        User.findAll({
        }).then((users) => {
            res.render("user/friends/friends", { friends: friends, users: users, sessionUser: req.session.user })
        }).catch((err) => {
            console.log(err)
        })
    })


})

router.get("/user/sent", userLogin, (req, res) => {

    Friends.findAll({
        where: {
            answer: "P",
            idSender: req.session.user.id
        },
    }).then((friends) => {
        User.findAll({
            attributes: ['id', 'name', 'profession', 'avatar']
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
            idRecipient: req.session.user.id
        },
    }).then((friends) => {
        User.findAll({
            attributes: ['id', 'name', 'profession', 'avatar']
        }).then((users) => {
            res.render("user/friends/pending", { friends: friends, users: users, usuario: req.session.user })
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
            })

        }
        else {
            //res.redirect("/user/index")
        }
    }).catch(() => {
        //res.redirect("/user/index")
    })
})

router.post("/user/answer", userLogin, (req, res) => {
    let { response, id } = req.body

    console.log(id)
    console.log(req.session.user.id)

    id = parseFloat(id)

    if (response == "accept") {
        var answer = "A"
    } else {
        if (response == "decline") {
            var answer = "D"
        }
        else {
            res.redirect("/user/pending")
        }
    }
    if (answer == "A") {
        Friends.findOne({
            where: {
                idSender: id,
                idRecipient: req.session.user.id
            }
        }).then(user => {
            if (user != undefined) {
                Friends.update({
                    answer: answer
                }, {
                    where: {
                        idSender: id,
                        idRecipient: req.session.user.id
                    }
                }).then(() => {
                    res.redirect("/user/pending")
                }).catch(err => {
                    res.redirect("/user/pending")
                })
            }
            else {
                res.redirect("/user/pending")
            }
        }).catch(err => {
            console.log(err)
        })
    }
    else {
        Friends.destroy({
            where: {
                idSender: id,
                idRecipient: req.session.user.id
            }
        }).then(() => {
            res.redirect("/user/pending")
        }).catch(err => {
            res.redirect("/user/pending")
            console.log(err)
        })
    }
})


module.exports = router