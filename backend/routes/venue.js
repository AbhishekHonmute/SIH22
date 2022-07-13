const router = require("express").Router();
const Venue = require("../models/Venue");

router.route("/add_venue").post(async (req, res) => {
  try {
    const {
      venue_id,
      name,
      rent,
      capacity,
      ac,
      projector,
      internet,
      computer,
      power_backup,
      email,
      password,
      rating,
      address,
      slots_booked,
    } = req.body;

    console.log(
      venue_id,
      name,
      rent,
      capacity,
      ac,
      projector,
      internet,
      computer,
      power_backup,
      email,
      password,
      rating,
      address,
      slots_booked
    );

    const venue = await Venue.findOne({ venue_id });
    if (venue) {
      res.status(403).json({
        result: "Venue ID already exists. Enter a different Venue ID",
      });
    } else {
      try {
        const new_venue = new Venue({
          venue_id,
          name,
          rent,
          capacity,
          ac,
          projector,
          internet,
          computer,
          power_backup,
          email,
          password,
          rating,
          address,
          slots_booked,
        });
        console.log(new_venue);
        new_venue.save();
      } catch (error) {
        console.log(error.message);
      }
      res.status(200).json({
        result: "Venue Registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Cannot Register Venue",
    });
  }
});

router.route("/get_venue/:venue_id").get(async (req, res) => {
  try {
    const venue_id = req.params.venue_id;
    console.log(venue_id);
    const venue = await Venue.findOne({ venue_id });
    res.status(200).json({
      result: venue === null ? {} : venue,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch venue data !",
    });
  }
});

module.exports = router;
