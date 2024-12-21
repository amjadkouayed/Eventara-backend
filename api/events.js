const express = require("express")
const router = express.Router()
const {authenticate} = require("./auth")
const pool = require("../db")



// http://localhost:4000/events/create
router.post("/create", authenticate, async(req,res) => {
    const { title, description, date, location} = req.body

    try {
        const user_id = req.user.id
        const result = await pool.query(
            `INSERT INTO events (title, description, date, location, user_id)
             VALUES ($1, $2, $3, $4, $5)`,
             [title, description, date, location, user_id]
        )
        res.status(201).json({
            message: "event successfully created",
        })
    } catch(err) {
        console.log(err.message)
        res.status(500).json({ error: "Internal server error" })
    }

})

// http://localhost:4000/events/list
router.get("/list", authenticate, async (req,res) => {

    try {
        const user_id = req.user.id
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [user_id])

        res.json(result.rows)
    }catch(err) {
        console.log("error getting events" + err.message)
        res.status(500).json({ error: "Internal server error" })
    }
})


// http://localhost:4000/events/delete/id
router.delete("/delete/:event_id", authenticate, async(req,res) => {
    
    try{
    const event_id = req.params.event_id
    const user_id = req.user.id
    console.log(event_id)
    console.log(user_id)

    if (!user_id || !event_id) {
        return res.status(400).json({ error: "User ID and Event ID are required.", message: `eventid = ${event_id} user_id = ${user_id}`});
    }
    const checkEventQuery = "SELECT * FROM events WHERE id = $1 AND user_id = $2 "
    const checkEventResult = await pool.query(checkEventQuery, [event_id, user_id])

    if (checkEventResult.rows.length === 0) {
        return res.status(404).json({ error: "Event not found or you are not the owner."
         });
    }

    const deleteQuery = 'DELETE FROM events WHERE id = $1 AND user_id = $2'
    await pool.query(deleteQuery, [event_id, user_id])

    res.json({message: "event deleted successfully"})
    }catch(err) {
        console.error("Error deleting event:", err.message)
        res.status(500).json({ error: "Internal server error" })
    }
 
})

//create a route to return one event


module.exports = router