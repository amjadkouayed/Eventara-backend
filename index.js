require("dotenv").config()
const express = require("express")
const bodyParser = require('body-parser');
const flash = require("express-flash")
const passport = require("passport")
const configureJwtPassport = require("./config/passport-config").configureJwtPassport

const app = express()
const port = 4000

const authRoutes = require("./api/auth")
const eventRoutes = require("./api/events")
const guestsRoutes = require("./api/event/guests")


app.use(flash())
app.use(bodyParser.json())

configureJwtPassport(passport)

app.use(passport.initialize())


app.use("/auth", authRoutes) // http://localhost:4000/auth
app.use("/events", eventRoutes) // http://localhost:4000/events
app.use("/events", guestsRoutes)

app.listen(port, () => {
    console.log(`listening on  ${port}` )
})

