const router = require("express").Router();
const Member = require("../models/Member");
const { compareHashedPassword, returnHashedPassowrd } = require("../util");

router.route("/signup").post(async (req, res) => {
  try {
    const {
      member_id,
      first_name,
      last_name,
      password,
      permission,
      email,
      cell_id,
      cell_designation,
      phone_no,
    } = req.body;
    console.log(
      member_id,
      first_name,
      last_name,
      password,
      permission,
      email,
      cell_id,
      cell_designation,
      phone_no
    );
    const member = await Member.findOne({ member_id });
    if (member) {
      res.status(403).json({
        result: "Member ID Already exists. Enter a different Member ID",
      });
    } else {
      returnHashedPassowrd(password)
        .then((hashedPassword) => {
          const new_member = new Member({
            member_id,
            first_name,
            last_name,
            permission,
            email,
            cell_id,
            cell_designation,
            phone_no,
            password: hashedPassword,
          });
          console.log(new_member);
          new_member.save();
        })
        .catch((error) => console.log(error.message));
      res.status(200).json({
        result: "Member registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Cannot Register Member",
    });
  }
});

router.route("/update_committee").post(async (req, res) => {
  try {
    const { committee_id, name, members } = req.body;
    console.log(committee_id, name, members);

    const old_query = { committee_id: committee_id };
    const new_data = {
      committee_id,
      name,
      members,
    };
    Committee.updateOne(old_query, new_data, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  } catch (error) {
    res.status(400).json({
      result: "Cannot Update Committee",
    });
  }
  res.status(200).json({
    result: "Committee Updated",
  });
});

router.route("/").get(async (req, res) => {
  try {
    res.status(200).send("Hello !");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route("/get_user/:member_id").get(async (req, res) => {
  try {
    const member_id = req.params.member_id;
    console.log(member_id);
    const member = await Member.findOne({ member_id });
    res.status(200).json({
      result: member === null ? {} : member,
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to fetch member data !",
    });
  }
});

module.exports = router;
