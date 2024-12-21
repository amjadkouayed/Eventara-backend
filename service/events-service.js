const pool = require("../db")

module.exports.getEvents = async (user_id) => {

    const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [user_id])

    return result

}