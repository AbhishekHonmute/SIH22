const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Canteen = mongoose.model("Canteen", new Schema({}, { strict: false }));

module.exports = Canteen;
