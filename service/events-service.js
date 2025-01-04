const pool = require("../db")

module.exports.getEvents = async (user_id) => {

    const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [user_id])

    return result.rows

}


module.exports.createEvent = async (title, description, date, location, user_id) => {

    const createQuery = `INSERT INTO events (title, description, date, location, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`
    const result = await pool.query(createQuery, [title, description, date, location, user_id])

    console.log(result.rows)
    return result.rows
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

module.exports.getSingleEvent = async (event_id, user_id) => {

    if(!event_id || !user_id) {
        return ({error:"Event Id and User Id required"})
    }

    const getEventResult = await pool.query("SELECT * FROM events WHERE ID = $1 AND user_id = $2", [event_id, user_id])

    if (getEventResult.rows.length === 0){
        return {error: "event not found or you are not the owner"}
    }

    return getEventResult.rows[0]
}

module.exports.updateEvent = async (event_id, user_id, updateData) => {
    if (!event_id || !user_id) {
        return { error: "Event Id and User Id are required" };
    }

    const { title, description, date, location} = updateData

    const fields = []
    const values = []
    let counter = 1

    //update query logic
    if (title){
        fields.push(`title = $${counter++}`) // title = $1 (uses the value of the counter first, then increments)
        values.push(title)
    }
    if (description) {
        fields.push(`description = $${counter++}`)
        values.push(description)
    }
    if (date) {
        fields.push(`date = $${counter++}`)
        values.push(date)
    }
    if (location) {
        fields.push(`location = $${counter++}`)
        values.push(location)
    }

    values.push(event_id, user_id)

    const query = ` UPDATE events SET ${fields.join(", ")} WHERE id = $${counter++} AND user_id = $${counter} RETURNING *; `

    const result = await pool.query(query, values)

    if (result.rows.length === 0){
        return {error: "event not found or you are not the owner"}
    }

    return result.rows[0]
}
