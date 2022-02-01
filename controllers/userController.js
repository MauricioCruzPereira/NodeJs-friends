const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const userLogin = require("../middlewares/userLogin")
const BiographyUser = require("../models/BiographyUser")
const userLogout = require("../middlewares/userLogout")
const Sequelize = require("sequelize")
const verifyCamp = require('../middlewares/verifyCamp')
const Op = Sequelize.Op
//middlewars para tratamentos de imagem, upload
const multer = require("multer")
//modulo nativo do node
//const path = require("path")
const uploadImage = require("../middlewares/uploadImage")
//mexer com arquivos
const fs = require("fs")

const Friends = require("../models/Friends")


router.get("/users/register", userLogout, (req, res) => {
    let nameError = req.flash("nameError")
    let emailError = req.flash("emailError")
    let passwordError = req.flash("passwordError")
    let professionError = req.flash("professionError");

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


    res.render('user/register', { nameError, emailError, passwordError, professionError, name: name, email: email, emailRegistered, registerSuccess })
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

router.post("/user/register", verifyCamp, (req, res) => {
    const { name, email, password, profession } = req.body

    if (name != "" && email != "" && password != "" && profession != "") {
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
                    profession,
                    password: hash,
                    avatar: "default-avatar-icon.png",
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
        req.flash("name", name)
        req.flash("email", email)

        res.redirect("/users/register")
    }

})

router.post("/user/login", verifyCamp, (req, res) => {
    const { email, password } = req.body

    let incorrect = "Email ou senha inválida"

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
                        profession: user.profession,
                        avatar: user.avatar,
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

router.post("/user/profession", userLogin, (req, res) => {
    let { profession, id } = req.body

    if (profession != "" && !isNaN(id)) {
        User.update({
            profession
        }, {
            where: {
                id
            }
        }).then(() => {
            req.session.user.profession = profession
            res.redirect("/user/profile")
        }).catch(err => {
            res.redirect("/user/profile")
        })
    }
    else {
        res.redirect("/user/profile")
    }

})

router.post("/user/avatar", userLogin, uploadImage.single('avatar'), (req, res) => {

    if (req.file) {
        /*
        console.log(req.file)
        console.log(req.file.filename)
        console.log(req.session.user.id)
        */
        //res.send("certo")

        if (req.session.user.avatar != "default-avatar-icon.png") {
            fs.unlink(`./public/uploads/${req.session.user.avatar}`, function (err, stats) {
                if (err) return console.log(err);
                console.log(stats);
            });
        }

        User.update({
            avatar: req.file.filename
        }, {
            where: {
                id: req.session.user.id
            }
        }).then(() => {
            req.session.user.avatar = req.file.filename;
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

router.get("/user/index", userLogin, (req, res) => {
    let usersFound = req.flash("usersFound")
    let search = req.flash("search")
    let notFound = req.flash("notFound")
    let searchError = req.flash("searchError")

    res.render("user/index", { usersFound: usersFound, search, notFound, searchError, user: req.session.user })
})

router.post("/user/users", userLogin, verifyCamp, (req, res) => {
    let { search } = req.body

    if (search != "") {
        User.findAll({
            where: {
                name: {
                    [Op.like]: `${search}%`
                }
            },
            attributes: ['id', 'name', 'profession', 'avatar'],
            order: [
                ['name', 'ASC']
            ]
        }).then(usersFound => {
            //console.log(search)
            console.log(usersFound)
            //console.log(usersFound[0].users)
            if (usersFound.length != 0) {
                req.flash("search", search)
                req.flash("usersFound", usersFound)
                res.redirect("/user/index")
            }
            else {
                let notFound = "Nenhuma pessoa cadastrada com esse nome"
                req.flash("notFound", notFound)
                res.redirect("/user/index")
            }
        }).catch(() => {
            res.redirect("/user/index")
        })
    }
    else {
        res.redirect("/user/index")
    }

})

module.exports = router