const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = mongoose.model("Admin", new Schema({}, { strict: false }));

module.exports = Admin;
