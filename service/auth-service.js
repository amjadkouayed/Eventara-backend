const pool = require("../db")

module.exports.registerUser =  async (name, email, password) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password])
    
    return {message: "user created"}
}