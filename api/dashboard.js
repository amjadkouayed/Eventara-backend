const express = require("express")
const router = express.Router()
const {authenticate} = require("./auth")

//http://localhost:4000/dashboard
router.get("/dashboard", authenticate, (req,res) => {

    res.status(200).json({message: "here is the dahboard"})
    
    
})

module.exports = router