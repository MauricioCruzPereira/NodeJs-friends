const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const userLogin = require("../middlewares/userLogin")
const BiographyUser = require("../models/BiographyUser")
const userLogout = require("../middlewares/userLogout")

router.get("/users/register", userLogout, (req, res) => {
    let nameError = req.flash("nameError")
    let emailError = req.flash("emailError")
    let passwordError = req.flash("passwordError")

    let name = req.flash("name")
    let email = req.flash("email")

    let registerSuccess = req.flash("registerSuccess")

    let emailRegistered = req.flash("emailRegistered")

    nameError = (nameError == undefined || nameError.length == 0) ? undefined : nameError
    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError

    name = (name == undefined || name.length == 0) ? "" : name
    email = (email == undefined || email.length == 0) ? "" : email

    registerSuccess = (registerSuccess == undefined || registerSuccess.length == 0) ? undefined : registerSuccess
    emailRegistered = (emailRegistered == undefined || emailRegistered.length == 0) ? undefined : emailRegistered


    res.render('user/register', { nameError, emailError, passwordError, name: name, email: email, emailRegistered, registerSuccess })
})

router.get("/users/login", userLogout, (req, res) => {
    let emailError = req.flash("emailError")
    let passwordError = req.flash("passwordError")

    let incorrect = req.flash("incorrect")

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError


    incorrect = (incorrect == undefined || incorrect.length == 0) ? "" : incorrect

    res.render('user/login', { emailError, passwordError, incorrect })
})

router.get("/user/profile", userLogin, (req, res) => {
    console.log(req.session.user)
    BiographyUser.findOne({
        where: {
            userId: req.session.user.id
        }
    }).then(bio => {
        res.render("user/profile", { user: req.session.user, bio })
    })

})

router.post("/user/register", (req, res) => {
    const { name, email, password } = req.body

    let nameError
    let emailError
    let passwordError

    if (name == "" || name == undefined) {
        nameError = "Nome não pode ser vázio"
    }

    if (email == "" || email == undefined) {
        emailError = "Email não pode ser vázio"
    }

    if (password == "" || password == undefined) {
        passwordError = "Senha não pode ser vázia"
    }

    if (name != "" && email != "" && password != "") {
        User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user == undefined) {
                let salt = bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(password, salt)

                User.create({
                    name,
                    email,
                    password: hash,
                    admin: false
                }).then(() => {
                    //deu certo
                    let registerSuccess = "Cadastrado com sucesso"
                    req.flash("registerSuccess", registerSuccess)

                    res.redirect("/users/register")
                }).catch(() => {
                    //deu erro
                    res.redirect("/users/register")
                })

            }
            else {
                let emailRegistered = "Email já cadastrado"
                req.flash("emailRegistered", emailRegistered)
                req.flash("name", name)

                res.redirect("/users/register")
            }
        })
    }
    else {
        req.flash("nameError", nameError)
        req.flash("emailError", emailError)
        req.flash("passwordError", passwordError)

        req.flash("name", name)
        req.flash("email", email)

        res.redirect("/users/register")
    }

})

router.post("/user/login", (req, res) => {
    const { email, password } = req.body

    let incorrect = "Email ou senha inválida"
    let emailError
    let passwordError

    if (email == "" || email == undefined) {
        emailError = "Email não pode ser vázio"
    }

    if (password == "" || password == undefined) {
        passwordError = "Senha não pode ser vázia"
    }

    if (email != "" && password != "") {
        User.findOne({
            where: {
                email
            }
        }).then(user => {
            if (user != undefined) {
                let correct = bcrypt.compareSync(password, user.password)

                if (correct) {
                    req.session.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin
                    }
                    res.redirect("/user/index")
                }
                else {
                    req.flash("incorrect", incorrect)
                    res.redirect("/users/login")
                }
            }
            else {
                req.flash("incorrect", incorrect)
                res.redirect("/users/login")
            }
        })
    }
    else {
        req.flash("emailError", emailError)
        req.flash("passwordError", passwordError)
        req.flash("email", email)

        res.redirect("/users/login")
    }

})

router.post("/biography", userLogin, (req, res) => {
    let { biography, id } = req.body
    if (biography != "") {
        BiographyUser.findOne({
            where: {
                userId: id
            }
        }).then(user => {
            if (user == null) {
                BiographyUser.create({
                    biography,
                    userId: id
                }).then(() => {
                    res.redirect("/user/profile")
                })
            }
            else {
                BiographyUser.update({
                    biography
                }, {
                    where: {
                        userId: id
                    }
                }).then(() => {
                    res.redirect("/user/profile")
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }
    else {
        res.redirect("/user/profile")
    }
})

router.get("/biography/:id", userLogin, (req, res) => {
    let { id } = req.params
    console.log(id)

    if (id != null) {
        if (!isNaN(id)) {
            BiographyUser.destroy({
                where: {
                    userId: id
                }
            }).then(() => {
                res.redirect("/user/profile")
            })
        }
        else {
            res.redirect("/user/profile")
        }
    }
    else {
        res.redirect("/user/profile")
    }
})

router.post("/user/name", userLogin, (req, res) => {
    let { name, id } = req.body
    console.log(name)
    console.log(id)

    if (name != "" && !isNaN(id)) {
        User.update({
            name
        }, {
            where: {
                id
            }
        }).then(() => {
            req.session.user.name = name
            res.redirect("/user/profile")
        }).catch(err => {
            res.redirect("/user/profile")
        })
    }
    else {
        res.redirect("/user/profile")
    }

})

router.get("/logout", userLogin, (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

router.get("/user/index", (req, res) => {
    User.findAll().then(users => {
        res.render("user/index", { users: users })
    })
})

module.exports = router