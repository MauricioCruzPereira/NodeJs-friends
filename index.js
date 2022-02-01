const express = require("express")
const app = express()

const flash = require('express-flash')

//sessão
const cookieParser = require("cookie-parser")
const session = require('express-session')

//banco de dados
const connection = require("./database/database")

//controllers
const userController = require('./controllers/userController')
const adminController = require('./controllers/adminController')
const friendsController = require('./controllers/friendsController')

//modals
const User = require("./models/User")
const BiographyUser = require("./models/BiographyUser")
const Friends = require("./models/Friends")


//middlewars
const userLogout = require("./middlewares/userLogout")


app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(cookieParser("cfmsdanioudfkshniksd"))
//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 400000000000 }
}))

//express-flash
app.use(flash())

//banco de dados
connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso")
}).catch((error) => {
    console.log(error)
})

app.use(flash())

app.use("/", userController)
app.use("/", adminController)
app.use("/", friendsController)

app.get("/", userLogout, (req, res) => {
    res.render("index")
})

app.get("/*", (req, res) => {
    res.render("index")
})

app.listen(9898, () => {
    console.log("porta: 9898")
})