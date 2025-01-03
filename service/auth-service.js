require('dotenv').config({ path: '../.env' });
const pool = require("../db")
const bcrypt = require("bcrypt")
const jsonwebtoken = require('jsonwebtoken')
const path = require("path")

const privateKey = process.env.JWT_PRIVATE_KEY

module.exports.registerUser =  async (name, email, password) => {

    try {

    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
        return { error: "failed to register user" };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', [name, email, hashedPassword])

    return {message: "user created successfuly", userId: result.rows[0].id }

    } catch(err){
        return {message: "error saving user", error: err.message}
    }
}

module.exports.authenticateUser = async (email, password) => {

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        if (result.rows.length === 0) {
            return {error: "login failed"};
        }
        const user = result.rows[0]
        const userId = user.id

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return {error: "login failed"}
        }

        return {userId, message: "user logged in"}


    }catch(err){
        return err.message
    }
}

module.exports.issueJWT = (userId) => {
  
    const expiresIn = '1d';
  
    const payload = {
      sub: userId,
      iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, privateKey, { expiresIn: expiresIn, algorithm: 'RS256' });
  
    return {
      token: "Bearer " + signedToken,
      expires: expiresIn
    }
  }