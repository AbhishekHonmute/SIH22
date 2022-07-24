const router = require("express").Router();
const Canteen = require("../models/Canteen");
const Order = require("../models/Order");
const Event = require("../models/Event");
const { compareHashedPassword, returnHashedPassowrd } = require("../util");

router.route("/add_canteen").post(async (req, res) => {
  try {
    const {
      canteen_id,
      name,
      email,
      password,
      rating,
      counter,
      menu,
      serviceable_to,
      phone_no,
    } = req.body;
    console.log(
      canteen_id,
      name,
      email,
      password,
      rating,
      counter,
      menu,
      serviceable_to,
      phone_no
    );

    const canteen = await Canteen.findOne({ canteen_id });
    if (canteen) {
      res.status(403).json({
        result: "Canteen ID already exists. Enter a different Canteen ID",
      });
    } else {
      returnHashedPassowrd(password)
        .then((hashedPassword) => {
        const new_canteen = new Canteen({
          canteen_id,
          name,
          email,
          password:hashedPassword,
          rating,
          counter,
          menu,
          serviceable_to,
          phone_no,
        });
        console.log(new_canteen);
        new_canteen.save();
      })
      .catch((error) => console.log(error.message));
      res.status(200).json({
        result: "Canteen Registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Cannot Register Canteen",
    });
  }
});

router.route("/update_canteen").post(async (req, res) => {
  try {
    const {
      canteen_id,
      name,
      email,
      password,
      rating,
      counter,
      menu,
      serviceable_to,
      phone_no,
    } = req.body;
    console.log(
      canteen_id,
      name,
      email,
      password,
      rating,
      counter,
      menu,
      serviceable_to,
      phone_no
    );

    const old_query = { canteen_id: canteen_id };

    const new_data = {
          canteen_id,
          name,
          email,
          password,
          rating,
          counter,
          menu,
          serviceable_to,
          phone_no,
        };
    Canteen.updateOne(old_query, new_data, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  } catch (error) {
    res.status(400).json({
      result: "Cannot Update Canteen",
    });
  }
  res.status(200).json({
    result: "Canteen Updated",
  });
});

router.route("/delete_canteen/:canteen_id").delete(async (req, res) => {
  try {
    const canteen_id = req.params.canteen_id;
    console.log(canteen_id);
    await Canteen.deleteOne({ canteen_id });
    await Order.deleteMany({ canteen_id });
    console.log("No error here bro");
    res.status(200).json({
      result: "Canteen deleted",
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to delete canteen",
    });
  }
});

router.route("/get_canteen/:canteen_id").get(async (req, res) => {
  try {
    const canteen_id = req.params.canteen_id;
    console.log(canteen_id);
    const canteen = await Canteen.findOne({ canteen_id });
    res.status(200).json({
      result: canteen === null ? {} : canteen,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch canteen data !",
    });
  }
});

module.exports = router;

// "menu": [{"item_id": "C01M1", "item_name": "roti", "item_price": 10, "is_veg": 1}, {"item_id": "C01M2", "item_name": "samosa", "item_price": 20, "is_veg": 1}, {"item_id": "C01M3", "item_name": "rice", "item_price": 100, "is_veg": 1}],

// "serviceable_to":[{"venue_id": "H01"}],
