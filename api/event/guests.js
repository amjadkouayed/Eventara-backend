const express = require("express")
const router = express.Router()
const service = require("../../service/guests-service")


router.get("/:event_id/guests", async(req, res) => {
    const event_id = req.params.event_id

    try {
        const result = await service.getGuests(event_id)

        if (result.rows.length === 0) {
            res.status(404).json({error: "no guests found"})
        }
        res.status(200).json(result.rows)

    }catch (error) {
        console.error("error getting guests", error.message)
        res.status(500).json({error: "internal server error"})
    }
})


router.post("/:event_id/guests", async(req, res) => {
    const event_id = req.params.event_id
    const {firstName, lastName, email, phoneNumber} = req.body
    try{
        const result = await service.addGuest(firstName, lastName, email, phoneNumber, event_id)

        res.status(200).json({message:"successfuly added guest", guestId: result})
    } catch(error){
        console.error("error adding guest", error.message)
        res.status(500).json({error: "internal server error"})
    }

})


router.delete("/:event_id/guests/:guest_id", async(req,res) => {
    const eventId = req.params.event_id
    const guestId = req.params.guest_id
    try{
        const result = await service.deleteGuest(guestId, eventId)
        if (result.error) {
            return res.status(404).json("guest not found")
        }
        res.status(200).json(result)

    }catch(err) {
        console.error("Error deleting guest")
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router