const router = require("express").Router();
const Venue = require("../models/Venue");
const Event = require("../models/Event");
const Order = require("../models/Order");
const { returnHashedPassowrd, compareHashedPassword } = require("../util");

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
        returnHashedPassowrd(password)
        .then((hashedPassword) => {
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
            password: hashedPassword,
            rating,
            address,
            slots_booked,
          });
          console.log(new_venue);
          new_venue.save();
        })
        .catch((error) => console.log(error.message));
      res.status(200).json({
        result: "Venue Registered",
      });
    }
  }
  catch (error) {
    res.status(400).json({
      result: "Cannot Register Venue",
    });
  }
});

router.route("/update_venue").post(async (req, res) => {
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
      oldpassword,
      newpassword,
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
      oldpassword,
      newpassword,
      rating,
      address,
      slots_booked
    );
    const new_data = {
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
    };
    if(oldpassword === null || newpassword === null || (oldpassword === "" && newpassword === "")) {
      const old_query = { venue_id: venue_id, password:password };
      Venue.updateOne(old_query, new_data, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    }
    else if(compareHashedPassword(oldpassword, password) === true) {
      returnHashedPassowrd(newpassword)
        .then((hashedPassword) => {
          console.log("NEW PASS : " + newpassword + " : " + hashedPassword);
          const old_query = { venue_id: venue_id };
          new_data[password] = hashedPassword;
          Venue.updateOne(old_query, new_data, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          })
        })
        .catch((error) => console.log(error.message));
    }
    console.log("PASSWORD DID NOT MATCH");
  } catch (error) {
    res.status(400).json({
      result: "Cannot Update Venue",
    });
  }
  res.status(200).json({
    result: "Venue Updated",
  });
});

router.route("/delete_venue/:venue_id").delete(async (req, res) => {
  try {
    const venue_id = req.params.venue_id;
    console.log(venue_id);
    await Venue.deleteOne({ venue_id });
    await Event.deleteMany({ venue_id });
    await Order.deleteMany({ venue_id });
    console.log("No error here bro");
    res.status(200).json({
      result: "Venue deleted",
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to delete venue",
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

router.route("/get_venues").get(async (req, res) => {
  console.log("FETCHING");
  try {
    await Venue.find()
    .then((venues) => {
      data = {}
      for (const [key, value] of Object.entries(venues)) {
        data[key] = {"id": value.venue_id, "name": value.name};
      }
      res.status(200).json({
        result: data,
      })
    })
    .catch((error) => {
      res.status(400).json({
        result: error.message,
      })
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch venue data !",
    }) 
  }
})

module.exports = router;

// "slots_booked":[{"event_id": "CN01", "start_time": {"$date":{"$numberLong":"-3722524108000"}}, "end_time": {"$date":{"$numberLong":"-3722437708000"}}}, {"event_id": "0", "start_time": {"$date":{"$numberLong":"-3752524108000"}}, "end_time": {"$date":{"$numberLong":"-3762437708000"}}}]
