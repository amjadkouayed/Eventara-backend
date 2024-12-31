require("dotenv").config()

const express = require("express")
const bodyParser = require('body-parser');
const flash = require("express-flash")

const app = express()
const port = 4000

const authRoutes = require("./api/auth")
const eventRoutes = require("./api/events")

configureLocalPassport(passport)

app.use(flash())
app.use(bodyParser.json())


app.use("/auth", authRoutes) // http://localhost:4000/auth
app.use("/events", eventRoutes) // http://localhost:4000/events

app.listen(port, () => {
    console.log(`listening on  ${port}` )
})

