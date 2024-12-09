const express = require("express")

const router = express.Router()

let events = ["wedding1", "wedding2", "party"]

// http://localhost:4000/events/create
router.post("/create", (req,res) => {
    const { event } = req.body
    events.push(event)
    res.json({data: events})
})

// http://localhost:4000/events/delete
router.delete("/delete", (req,res) => {
    res.json({message: "event deleted"})
})

// http://localhost:4000/events/list
router.get("/list", (req,res) => {
    res.json({data: events})
})

module.exports = router