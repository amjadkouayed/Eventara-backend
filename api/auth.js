const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const passport = require("passport")
const pool = require("../db")
const {registerUser, authenticateUser, issueJWT} = require("../service/auth-service")


// http://localhost:4000/auth/login
router.post("/login", async (req, res) => {
    const {email, password} = req.body 

    try{
        const result = await authenticateUser(email, password)

        if (result.error) {
            return res.status(400).json(result);
        }
        
        console.log(result)

        const jwt = issueJWT(result.user.id)

        res.status(200).json({message: "successfuly logged in", token: jwt.token, expiresIn: jwt.expires})
    
    }catch(err) {
        res.status(400).json({error: error.message})
    }
}
) 

// http://localhost:4000/auth/register
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        throw new Error("name, email, password required")
    }

    try {
        const result = await registerUser(name, email, password)

        if (result.error) {
            return res.status(400).json(result);
        }

        

        res.status(200).json(result)

    } catch (error){

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