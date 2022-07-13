const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Committee = mongoose.model(
  "Committee",
  new Schema({}, { strict: false })
);

module.exports = Committee;
