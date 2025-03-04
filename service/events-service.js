const { PrismaClient } = require("@prisma/client");

prisma = new PrismaClient();

module.exports.getEvents = async (userId) => {
  const events = await prisma.events.findMany({
    where: {
      user_id: userId,
    },
  });

  return events;
};

module.exports.createEvent = async (
  title,
  description,
  date,
  location,
  userId
) => {
  // const createQuery = `INSERT INTO events (title, description, date, location, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  // const result = await pool.query(createQuery, [
  //   title,
  //   description,
  //   date,
  //   location,
  //   user_id,
  // ]);
  const newEvent = await prisma.events.create({
    data: {
      title: title,
      description: description,
      date: new Date(date),
      location: location,
      user_id: userId,
    },
  });

  return newEvent.id;
};

module.exports.deleteEvent = async (eventId, userId) => {
  // const checkEventQuery =
  //   "SELECT * FROM events WHERE id = $1 AND user_id = $2 ";
  // const checkEventResult = await pool.query(checkEventQuery, [
  //   event_id,
  //   user_id,
  // ]);
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
      user_id: userId,
    },
  });

  if (!event) {
    return { error: "Event not found" };
  }

  // const deleteQuery = "DELETE FROM events WHERE id = $1 AND user_id = $2";
  // await pool.query(deleteQuery, [event_id, user_id]);
  const deletedEvent = await prisma.events.delete({
    where: {
      id: eventId,
      user_id: userId,
    },
  });

  return { message: "Event deleted successfully" };
};

module.exports.getSingleEvent = async (eventId, userId) => {
  // const getEventResult = await pool.query(
  //   "SELECT * FROM events WHERE ID = $1 AND user_id = $2",
  //   [event_id, user_id]
  // );
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
      user_id: userId,
    },
  });

  if (!event) {
    return { error: "event not found" };
  }

  return event;
};

module.exports.updateEvent = async (eventId, userId, updateData) => {
  const { title, description, date, location } = updateData;

  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
      user_id: userId,
    },
  });

  if (!event) {
    return { error: "event not found" };
  }

  const dataToUpdate = {};
  if (title) dataToUpdate.title = title;
  if (description) dataToUpdate.description = description;
  if (date) dataToUpdate.date = new Date(date);
  if (location) dataToUpdate.location = location;

  const updatedEvent = prisma.events.update({
    where: {
      id: eventId,
      user_id: userId,
    },

    data: dataToUpdate,
  });

  return updatedEvent;

  // const fields = [];
  // const values = [];
  // let counter = 1;

  // //update query logic
  // if (title) {
  //   fields.push(`title = $${counter++}`); // title = $1 (uses the value of the counter first, then increments)
  //   values.push(title);
  // }
  // if (description) {
  //   fields.push(`description = $${counter++}`);
  //   values.push(description);
  // }
  // if (date) {
  //   fields.push(`date = $${counter++}`);
  //   values.push(date);
  // }
  // if (location) {
  //   fields.push(`location = $${counter++}`);
  //   values.push(location);
  // }

  // values.push(event_id, user_id);

  // const query = ` UPDATE events SET ${fields.join(
  //   ", "
  // )} WHERE id = $${counter++} AND user_id = $${counter} RETURNING *; `;

  // const result = await pool.query(query, values);
};
