const express = require("express");
const router = express.Router();
const service = require("../../service/guests-service");

router.get("/:event_id/guests", async (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);

  try {
    const guests = await service.getGuests(eventId);

    if (!guests) {
      res.status(404).json({ error: "no guests found" });
    }
    res.status(200).json(guests);
  } catch (error) {
    console.error("error getting guests", error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/:event_id/guests", async (req, res) => {
  const eventId = parseInt(req.params.event_id);
  const { firstName, lastName, email } = req.body;
  try {
    const result = await service.addGuest(firstName, lastName, email, eventId);

    res
      .status(200)
      .json({ message: "successfuly added guest", guestId: result });
  } catch (error) {
    console.error("error adding guest", error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/:event_id/guests/:guest_id", async (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);
  const guestId = parseInt(req.params.guest_id, 10);
  try {
    const result = await service.deleteGuest(guestId, eventId);
    console.log(result);
    if (result.error) {
      return res.status(404).json("guest not found");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting guest");
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
