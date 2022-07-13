const router = require("express").Router();
const Committee = require("../models/Committee");

router.route("/add_committee").post(async (req, res) => {
  try {
    const { committee_id, name, members } = req.body;
    console.log(committee_id, name, members);

    const committee = await Committee.findOne({ committee_id });
    if (committee) {
      res.status(403).json({
        result: "Committee ID already exists. Enter a different Committee ID",
      });
    } else {
      try {
        const new_committee = new Committee({
          committee_id,
          name,
          members,
        });
        console.log(new_committee);
        new_committee.save();
      } catch (error) {
        console.log(error.message);
      }
      res.status(200).json({
        result: "Committee Registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Cannot Register Committee",
    });
  }
});

router.route("/get_committee/:committee_id").get(async (req, res) => {
  try {
    const committee_id = req.params.committee_id;
    console.log(committee_id);
    const committee = await Committee.findOne({ committee_id });
    res.status(200).json({
      result: committee === null ? {} : committee,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch committee data !",
    });
  }
});

module.exports = router;
