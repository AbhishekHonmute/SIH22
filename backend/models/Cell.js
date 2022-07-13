const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cell = mongoose.model("Cell", new Schema({}, { strict: false }));

module.exports = Cell;
