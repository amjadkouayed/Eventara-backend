const express = require("express")

const router = express.Router()

let events = ["wedding1", "wedding2", "party"]

// http://localhost:4000/events/create
router.post("/create", (req,res) => {
    const { event } = req.body

    if (!event) {
        return res.status(400).json({
            success : false,
            message : "Event name required"
        })
    }
    events.push(event)

    res.status(201).json({
        success : true,
        data : events,
        message : "event created successfuly"
    })

    console.log(events)
})

// http://localhost:4000/events/list
router.get("/list", (req,res) => {
    if (events.length === 0) {
        res.status(404).json({
            success: false,
            message: "No events found",
        })
    }

    res.status(200).json({
        success: true,
        data: events
    })
})


// http://localhost:4000/events/delete/id
router.delete("/delete/:id", (req,res) => {
    const id = req.params.id

    if (id < 0 || id >= events.length) {
        
        return res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

    const deletedEvent = events.splice(id, 1)

    res.status(200).json({
        success: true,
        message: `event ${deletedEvent} got deleted`,
        data: events
    })
    
})


module.exports = router