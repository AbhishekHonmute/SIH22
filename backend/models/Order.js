const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = mongoose.model("Order", new Schema({}, { strict: false }));

module.exports = Order;
