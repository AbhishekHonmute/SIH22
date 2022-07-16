const router = require("express").Router();
const Event = require("../models/Event");
const Venue = require("../models/Venue");
const Order = require("../models/Order");

router.route("/add_event").post(async (req, res) => {
  try {
    const {
      event_id,
      name,
      event_creator_id,
      description,
      approval,
      start_time,
      end_time,
      expected_attendance,
      actual_attendance,
      event_summary,
      available_budget,
      venue_id,
      venue_status,
      order_id,
      order_status,
      members_list,
      spendings,
    } = req.body;

    console.log(
      event_id,
      name,
      event_creator_id,
      description,
      approval,
      start_time,
      end_time,
      expected_attendance,
      actual_attendance,
      event_summary,
      available_budget,
      venue_id,
      venue_status,
      order_id,
      order_status,
      members_list,
      spendings
    );

    const event = await Event.findOne({ event_id });
    if (event) {
      res.status(403).json({
        result: "Event ID already exists. Enter a different Event ID",
      });
    } else {
      try {
        const new_event = new Event({
          event_id,
          name,
          event_creator_id,
          description,
          approval,
          start_time,
          end_time,
          expected_attendance,
          actual_attendance,
          event_summary,
          available_budget,
          venue_id,
          venue_status,
          order_id,
          order_status,
          members_list,
          spendings,
        });
        console.log(new_event);
        new_event.save();
      } catch (error) {
        console.log(error.message);
      }
      res.status(200).json({
        result: "Event Registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Cannot Register Event",
    });
  }
});

router.route("/update_event").post(async (req, res) => {
  try {
    const {
      event_id,
      name,
      event_creator_id,
      description,
      approval,
      start_time,
      end_time,
      expected_attendance,
      actual_attendance,
      event_summary,
      available_budget,
      venue_id,
      venue_status,
      order_id,
      order_status,
      members_list,
      spendings,
    } = req.body;
    console.log(
      event_id,
      name,
      event_creator_id,
      description,
      approval,
      start_time,
      end_time,
      expected_attendance,
      actual_attendance,
      event_summary,
      available_budget,
      venue_id,
      venue_status,
      order_id,
      order_status,
      members_list,
      spendings
    );

    const old_query = { event_id: event_id };
    const new_data = {
      event_id,
      name,
      event_creator_id,
      description,
      approval,
      start_time,
      end_time,
      expected_attendance,
      actual_attendance,
      event_summary,
      available_budget,
      venue_id,
      venue_status,
      order_id,
      order_status,
      members_list,
      spendings,
    };
    Event.updateOne(old_query, new_data, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  } catch (error) {
    res.status(400).json({
      result: "Cannot Update Event",
    });
  }
  res.status(200).json({
    result: "Event Updated",
  });
});

router.route("/delete_event/:event_id").delete(async (req, res) => {
  try {
    const event_id = req.params.event_id;
    console.log(event_id);
    await Event.deleteOne({ event_id });
    await Order.deleteMany({ event_id });
    const old_query = {};
    const new_query = { $pull: { slots_booked: { event_id: event_id } } };
    await Venue.updateMany(old_query, new_query);
    console.log("No error here bro");
    res.status(200).json({
      result: "Venue deleted",
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to delete event",
    });
  }
});

router.route("/get_event/:event_id").get(async (req, res) => {
  try {
    const event_id = req.params.event_id;
    console.log(event_id);
    const event = await Event.findOne({ event_id });
    res.status(200).json({
      result: event === null ? {} : event,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch event data !",
    });
  }
});

module.exports = router;

// "slots_booked":[{"event_id": "CN01", "start_time": {"$date":{"$numberLong":"-3722524108000"}}, "end_time": {"$date":{"$numberLong":"-3722437708000"}}}, {"event_id": "0", "start_time": {"$date":{"$numberLong":"-3752524108000"}}, "end_time": {"$date":{"$numberLong":"-3762437708000"}}}]

// "members_list":[{"member_id": "AH01", "member_role": "Presenter"}]

// "spendings":{"venue": 5000, "canteen": 1000, "other": 200}
