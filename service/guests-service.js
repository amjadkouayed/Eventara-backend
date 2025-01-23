const pool = require("../db");
const { PrismaClient } = require("@prisma/client");

prisma = new PrismaClient();
module.exports.getGuests = async (eventId) => {
  const Guests = await prisma.guests.findMany({ where: { event_id: eventId } });

  return Guests;
};

module.exports.addGuest = async (firstName, lastName, email, eventId) => {
  const addedGuest = await prisma.guests.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      event_id: eventId,
    },
  });
  // const query = "INSERT INTO guests (first_name, last_name, email, phone_number, event_id) VALUES ($1, $2, $3, $4, $5) RETURNING id"
  // const result = await pool.query(query, [firstName, lastName, email, phoneNumber, event_id])

  return addedGuest;
};

module.exports.deleteGuest = async (guestId, eventId) => {
  const guest = await prisma.guests.findUnique({
    where: {
      id: guestId,
      event_id: eventId,
    },
  });

  if (!guest) {
    return { error: "event not found or you are not the owner" };
  }

  //   const deleteQuery = "DELETE FROM guests WHERE id = $1 AND event_id = $2";
  //   await pool.query(deleteQuery, [guestId, event_id]);
  const deletedGuest = await prisma.guests.delete({
    where: {
      id: guestId,
      event_id: eventId,
    },
  });

  return { message: "guest deleted successfully" };
};
