require("dotenv").config()

const express = require("express")
const bodyParser = require('body-parser');
const session = require("express-session")
const passport = require("passport")
const flash = require("express-flash")
const configureLocalPassport = require("./strategies/local-strategy")

const app = express()
const port = 4000

const authRoutes = require("./api/auth")
const eventRoutes = require("./api/events")

configureLocalPassport(passport)

app.use(flash())
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", authRoutes) // http://localhost:4000/auth
app.use("/events", eventRoutes) // http://localhost:4000/events

app.listen(port, () => {
    console.log(`listening on  ${port}` )
})

