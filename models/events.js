const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  calendar: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model("events", eventSchema);
