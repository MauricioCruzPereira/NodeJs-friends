const fromTo = [
    ["name", "Nome"],
    ["email", "Email"],
    ["password", "Senha"],
    ["search", "Pesquisa"],
    ["profession", "Profissão"]
]

function verifyCamp(req, res, next) {
    Object.keys(req.body).forEach(function (key) {

        if (req.body[key] == "" || req.body[key] == undefined || key.length == 0) {
            let word

            for (let e of fromTo) {
                if (e[0] == key) {
                    word = e[1]
                }
            }
            let msg = `${word} não pode ficar em branco.`
            req.flash(`${key}Error`, msg)
        }

    });

    next()
}

module.exports = verifyCamp
