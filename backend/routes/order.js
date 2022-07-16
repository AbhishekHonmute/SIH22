const router = require("express").Router();
const Order = require("../models/Order");
const Event = require("../models/Event");

router.route("/add_order").post(async (req, res) => {
  try {
    const { order_id, canteen_id, event_id, venue_id, amount, status, items } =
      req.body;
    console.log(
      order_id,
      canteen_id,
      event_id,
      venue_id,
      amount,
      status,
      items
    );

    const order = await Order.findOne({ order_id });
    if (order) {
      res.status(403).json({
        result: "Order ID already exists. Enter a different Order ID",
      });
    } else {
      try {
        const new_order = new Order({
          order_id,
          canteen_id,
          event_id,
          venue_id,
          amount,
          status,
          items,
        });
        console.log(new_order);
        new_order.save();
      } catch (error) {
        console.log(error.message);
      }
      res.status(200).json({
        result: "Order Registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Cannot Register Order",
    });
  }
});

router.route("/update_order").post(async (req, res) => {
  try {
    const { order_id, canteen_id, event_id, venue_id, amount, status, items } =
      req.body;
    console.log(
      order_id,
      canteen_id,
      event_id,
      venue_id,
      amount,
      status,
      items
    );

    const old_query = { order_id: order_id };
    const new_data = {
      order_id,
      canteen_id,
      event_id,
      venue_id,
      amount,
      status,
      items,
    };
    Order.updateOne(old_query, new_data, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  } catch (error) {
    res.status(400).json({
      result: "Cannot Update Order",
    });
  }
  res.status(200).json({
    result: "Order Updated",
  });
});

router.route("/delete_order/:order_id").delete(async (req, res) => {
  try {
    const order_id = req.params.order_id;
    console.log(order_id);
    await Order.deleteOne({ order_id });
    const old_query = { order_id: order_id };
    const new_query = { $set: { order_id: "" } };
    await Event.updateMany(old_query, new_query);
    console.log("No error here bro");
    res.status(200).json({
      result: "Order deleted",
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to delete order",
    });
  }
});

router.route("/get_order/:order_id").get(async (req, res) => {
  try {
    const order_id = req.params.order_id;
    console.log(order_id);
    const order = await Order.findOne({ order_id });
    res.status(200).json({
      result: order === null ? {} : order,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch order data !",
    });
  }
});

module.exports = router;

// "items": [{"item_id": "C01M1", "count": 10}, {"item_id": "C01M3", "count": 10}, {"item_id": "C01M3", "count": 10}]
