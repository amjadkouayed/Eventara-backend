const express = require("express")
const router = express.Router()
const pool = require("../db")
const {getEvents, createEvent, deleteEvent} = require("../service/events-service")
const passport = require("passport")


router.use(passport.authenticate("jwt", {session: false}))


// http://localhost:4000/events/create
router.post("/create", async (req,res) => {
    const { title, description, date, location} = req.body

    try {

        const user_id = req.user.id
        const result = await createEvent(title, description, date, location, user_id)

        res.status(201).json({ message: "event successfully created" })

    } catch(err) {
        console.log(err.message)
        res.status(500).json({ error: "Internal server error" })
    }

})
// http://localhost:4000/events/list
router.get("/list", async (req,res) => {


    try {
        const user_id = req.user.id
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const result = await getEvents(user_id)
        res.json(result.rows)

    }catch(err) {
        console.log(err.message)
        res.status(500).json({ error: "Internal server error" })
    }
})


// http://localhost:4000/events/delete/id
router.delete("delete/:event_id", async(req,res) => {
    
    try{
    const event_id = req.params.event_id
    const user_id = req.user.id

    const result = await deleteEvent(event_id, user_id)

    if (result.error) {
        return res.status(404).json({ error: result.error })
    }

    res.json(result)
    
    }catch(err) {
        console.error("Error deleting event:", err.message)
        res.status(500).json({ error: "Internal server error" })
    }
 
})

//create a route to return one event
router.get("/:event_id", async(req, res) => {



} )


module.exports = router