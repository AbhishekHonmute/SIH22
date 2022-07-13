const router = require("express").Router();
const Event = require("../models/Event");

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
