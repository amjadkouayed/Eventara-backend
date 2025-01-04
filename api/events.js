const express = require("express")
const router = express.Router()
const pool = require("../db")
const {getEvents, createEvent, deleteEvent, getSingleEvent, updateEvent} = require("../service/events-service")
const passport = require("passport")


router.use(passport.authenticate("jwt", {session: false}))



router.post("/", async (req,res) => {
    const {title, description, date, location} = req.body
    const user_id = req.user.id

    try {
        const result = await createEvent(title, description, date, location, user_id)

        res.status(201).json({ message: "event successfully created", event_id: result.id })

    } catch(err) {
        console.error("eror creating event", err.message)
        res.status(500).json({ error: "Internal server error" })
    }

})

router.get("/", async (req,res) => {   


    try {
        const user_id = req.user.id
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const result = await getEvents(user_id)
        res.json(result)

    }catch(err) {
        console.error("error getting events")
        res.status(500).json({ error: "Internal server error" })
    }
})



router.delete("/:event_id", async(req,res) => {
    
    try{
    const event_id = req.params.event_id
    const user_id = req.user.id

    const result = await deleteEvent(event_id, user_id)

    if (result.error) {
        return res.status(404).json(result.error)
    }

    res.json(result)
    
    }catch(err) {
        console.error("Error deleting event")
        res.status(500).json({ error: "Internal server error" })
    }
 
})

//create a route to return one event
router.get("/:event_id", async(req, res) => {
    const event_id = req.params.event_id
    const user_id = req.user.id

    try {
        const result = await getSingleEvent(event_id, user_id)
        
        if (result.error){
            return res.status(400).json(result.error)
        }

        res.status(200).json(result)

    } catch (err) {
        console.error("error getting event")
        res.status(500).json({ error: "Internal server error"})
    }
} )

//create update route
router.put("/:event_id", async (req, res) => {
    const event_id = req.params.event_id
    const user_id = req.user.id
    const updateData = req.body

    try{
        const result = await updateEvent(event_id, user_id, updateData)
        console.log(result)

        if (result.error){
            return res.status(400).json(result.error)
        }
        res.status(200).json({message: "event updated successfuly", new_values : result})

    }catch(err) {
        console.error("error getting event")
        res.status(500).json({ error: "Internal server error"})
    }
})


module.exports = router