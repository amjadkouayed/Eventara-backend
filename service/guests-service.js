const pool = require("../db")

module.exports.getGuests = async (events_id) => {

    const result = await pool.query("SELECT * FROM guests WHERE event_id = $1", [events_id])

    return result
}

module.exports.addGuest = async (firstName, lastName, email, phoneNumber, event_id) => {
    const query = "INSERT INTO guests (first_name, last_name, email, phone_number, event_id) VALUES ($1, $2, $3, $4, $5) RETURNING id"
    const result = await pool.query(query, [firstName, lastName, email, phoneNumber, event_id])

    return result.rows.id
}

module.exports.deleteGuest = async (guestId, event_id) => {
    const checkguestQuery = "SELECT * FROM guests WHERE id = $1 AND event_id = $2 "
    const checkguestResult = await pool.query(checkguestQuery, [guestId, event_id])

    if (checkguestResult.rows.length === 0) {
        return {error: "event not found or you are not the owner"}
    }

    const deleteQuery = "DELETE FROM guests WHERE id = $1 AND event_id = $2"
    await pool.query(deleteQuery, [guestId, event_id])

    return {message: "event deleted successfully"}

}