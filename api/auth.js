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

})) 

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


module.exports = router