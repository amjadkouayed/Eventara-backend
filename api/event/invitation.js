const express = require("express");
const router = express.Router();
const { sendInvitation } = require("../../service/send-email");
const { getSingleEvent } = require("../../service/events-service");
const { getGuests } = require("../../service/guests-service");

router.post("/:event_id/sendinvitations", async (req, res) => {
  const eventId = parseInt(req.params.event_id, 10);
  const { emailData } = req.body;
  try {
    const guests = await getGuests(eventId);
    if (!guests) {
      return res.status(404).json({ error: "No guests found" });
    }
    const emailPromises = guests.map((guest) =>
      sendInvitation(guest.email, emailData)
    );
    await Promise.all(emailPromises);
    res.status(200).json({ message: "Invitations sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
