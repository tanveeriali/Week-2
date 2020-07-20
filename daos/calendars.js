const Calendars = require("../models/calendars");

module.exports = {};

module.exports.create = async (name) => {
  return await Calendars.create({ name });
};

module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};

module.exports.getAll = async () => {
  try {
    const calendar = await Calendars.find();
    return calendar;
  } catch (e) {
    return null;
  }
};

module.exports.updateById = async (id, body) => {
  return await Calendars.update({ _id: id }, body);
};

module.exports.deleteById = async (id) => {
  try {
    const calendar = await Calendars.deleteOne({ _id: id });
    return calendar;
  } catch (e) {
    return null;
  }
};
