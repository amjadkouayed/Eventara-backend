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
  time,
  location,
  userId
) => {
  const newEvent = await prisma.events.create({
    data: {
      title: title,
      description: description,
      date: new Date(date),
      time: time,
      location: location,
      user_id: userId,
    },
  });

  return newEvent.id;
};

module.exports.deleteEvent = async (eventId, userId) => {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
      user_id: userId,
    },
  });

  if (!event) {
    return { error: "Event not found" };
  }

  const deletedEvent = await prisma.events.delete({
    where: {
      id: eventId,
      user_id: userId,
    },
  });

  return { message: "Event deleted successfully" };
};

module.exports.getSingleEvent = async (eventId, userId) => {
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
  const { title, description, date, time, location } = updateData;

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
  if (time) dataToUpdate.time = time;
  if (location) dataToUpdate.location = location;

  const updatedEvent = prisma.events.update({
    where: {
      id: eventId,
      user_id: userId,
    },

    data: dataToUpdate,
  });

  return updatedEvent;
};
