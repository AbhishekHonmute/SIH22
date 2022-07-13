const router = require("express").Router();
const Canteen = require("../models/Canteen");

router.route("/add_canteen").post(async (req, res) => {
  try {
    const {
      canteen_id,
      name,
      email,
      password,
      rating,
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
      try {
        const new_canteen = new Canteen({
          canteen_id,
          name,
          email,
          password,
          rating,
          menu,
          serviceable_to,
          phone_no,
        });
        console.log(new_canteen);
        new_canteen.save();
      } catch (error) {
        console.log(error.message);
      }
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
