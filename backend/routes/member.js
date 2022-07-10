const router = require("express").Router();
const Member = require("../models/Member");
const Types = require("mongoose").Types;

router.route("/verify/:email").get(async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Member.findOne({ email });
    res.status(200).json({
      result: user !== null,
    });
  } catch (error) {
    res.status(400).json({
      result: "Email check failed !",
    });
  }
});

router.route("/:email").get(async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Member.findOne({ email });
    res.status(200).json({
      result: user === null ? {} : user,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch user data !",
    });
  }
});

module.exports = router;
