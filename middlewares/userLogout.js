function userLogin(req, res, next) {
    if (req.session.user == undefined) {
        next()
    }
    else {
        res.redirect("/user/index")
    }
}

module.exports = userLogin