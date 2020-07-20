const Event = require("../models/events");

module.exports = {};

module.exports.create = async (name, calendar, date) => {
  return await Event.create({ name, calendar, date });
};

module.exports.getById = async (id, calendarid) => {
  try {
    const event = await Event.findOne({
      _id: id,
      calendar: calendarid,
    }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.getAll = async (calendarid) => {
  try {
    const event = await Event.find({ calendar: calendarid }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.updateById = async (id, body, calendarid) => {
  return await Event.update({ _id: id, calendar: calendarid }, body);
};

module.exports.deleteById = async (id, calendarid) => {
  try {
    const event = await Event.deleteOne({ _id: id, calendar: calendarid });
    return event;
  } catch (e) {
    return null;
  }
};
