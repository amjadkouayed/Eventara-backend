const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const passport = require("passport")
const pool = require("../db")
const {registerUser} = require("../service/auth-service")


// http://localhost:4000/auth/login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/event",
    failureRedirect: "/",
    failureFlash: true
})
) 

// http://localhost:4000/auth/register
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        throw new Error("name, email, password required")
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = registerUser(name, email, hashedPassword)

        res.status(200).json({message: "user created successufly"})

    } catch (error){

        console.log(error, `this is the error message ${error.message}`)
        res.status(400).json({error: error.message})

    }

})

router.get("/logout", (req,res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({message: "logout failed", error: err})
        }

        res.status(200).json({ message: "Successfully logged out" })
    })
})





function authenticate(req,res,next) {
    if (req.isAuthenticated()) return next();
     
    else{
        res.status(401).json({ error: "User not logged in" })
    }
}


module.exports = router
module.exports.authenticate = authenticate