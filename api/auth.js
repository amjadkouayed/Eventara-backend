const express = require("express")
const router = express.Router()

let users = ["user1", "user2",]



// http://localhost:4000/auth/login
router.post("/login", (req, res) => {
    console.log("login endpoint executed")
    const { user } = req.body
    users.push(user)
    res.json({message: "login endpoint executed"})
    console.log(users)
})



module.exports = router