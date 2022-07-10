const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Member = mongoose.model("Members", new Schema({}, { strict: false }));

module.exports = Member;
