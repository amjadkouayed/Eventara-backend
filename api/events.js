const express = require("express");
const router = express.Router();
const {
  getEvents,
  createEvent,
  deleteEvent,
  getSingleEvent,
  updateEvent,
} = require("../service/events-service");
const passport = require("passport");

router.use(passport.authenticate("jwt", { session: false }));

//create event
router.post("/", async (req, res) => {
  const { title, description, date, location } = req.body;
  const userId = req.user.id;

  try {
    const result = await createEvent(
      title,
      description,
      date,
      location,
      userId
    );
    res
      .status(201)
      .json({ message: "event successfully created", event_id: result });
  } catch (err) {
    res.status(500).json({ error: "Interna; server error" });
  }
});

//get all events
router.get("/", async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await getEvents(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete event
router.delete("/:event_id", async (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);
  const userId = req.user.id;

  try {
    const result = await deleteEvent(eventId, userId);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//get one event
router.get("/:event_id", async (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);
  const userId = req.user.id;

  try {
    const result = await getSingleEvent(eventId, userId);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//update an event
router.put("/:event_id", async (req, res) => {
  const event_id = parseInt(req.params.event_id, 10);
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const result = await updateEvent(event_id, userId, updateData);
    console.log(result);

    if (result.error) {
      return res.status(400).json(result.error);
    }
    res.status(200).json({ message: "event updated successfuly" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
