const express = require("express")
const router = express.Router()

let users = ["user1", "user2",]



// http://localhost:4000/auth/login
router.post("/login", (req, res) => {
    const { user } = req.body

    if (!user) {
        res.status(400).json({
            success: false,
            message: "user required"
        })
    }

    else {
    users.push(user)

    res.status(201).json({
        success: true,
        message: `user ${user} created`,
        data: users

        })
        console.log(users)
    }
})



module.exports = router