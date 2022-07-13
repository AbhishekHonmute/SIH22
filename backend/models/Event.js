const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Event = mongoose.model("Event", new Schema({}, { strict: false }));

module.exports = Event;
