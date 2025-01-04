const pool = require("../db")

module.exports.getEvents = async (user_id) => {

    const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [user_id])

    return result

}


module.exports.createEvent = async (title, description, date, location, user_id) => {

    const createQuery = `INSERT INTO events (title, description, date, location, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`
    const result = await pool.query(createQuery, [title, description, date, location, user_id])

    return result
}



module.exports.deleteEvent = async (event_id, user_id) => {

    if (!user_id || !event_id) {
        throw new Error("User ID and Event ID are required.");
    }

    const checkEventQuery = "SELECT * FROM events WHERE id = $1 AND user_id = $2 "
    const checkEventResult = await pool.query(checkEventQuery, [event_id, user_id])

    if (checkEventResult.rows.length === 0) {
        return { error: "Event not found or you are not the owner." }
    }

    const deleteQuery = 'DELETE FROM events WHERE id = $1 AND user_id = $2';
    await pool.query(deleteQuery, [event_id, user_id]);

    return { message: "Event deleted successfully" };  
}