const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const passport = require("passport")
const pool = require("../db")


// http://localhost:4000/auth/login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true
})
) 

// http://localhost:4000/auth/register
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword])
        

        res.status(200).json({
            message: "user created",
            data: result.rows
        })
    } catch (error){

        console.log(error.message)
        res.redirect("auth/register")

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