const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Venue = mongoose.model("Venue", new Schema({}, { strict: false }));

module.exports = Venue;
