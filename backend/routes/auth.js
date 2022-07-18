const router = require("express").Router();
const Member = require("../models/Member");
const Committee = require("../models/Committee");
const Event = require("../models/Event");
const Admin = require("../models/admin");
const { compareHashedPassword, returnHashedPassowrd } = require("../util");

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (user) {
      const parsedUser = JSON.parse(JSON.stringify(user));
      compareHashedPassword(password, parsedUser.password).then((result) => {
        if (result) {
          const token = "expeditetoken";
          const usertype = "Admin";
          console.log("Login Successful");
          res.status(200).json({
            result: { user: parsedUser, token, usertype },
          });
        } else {
          res.status(400).json({
            result: "Wrong password",
          });
        }
      });
    } else {
      const user = await Member.findOne({ email });
      if (user) {
        const parsedUser = JSON.parse(JSON.stringify(user));
        compareHashedPassword(password, parsedUser.password).then((result) => {
          if (result) {
            const token = "expeditetoken";
            const usertype = "Member";
            console.log("Login Successful");
            res.status(200).json({
              result: { user: parsedUser, token, usertype },
            });
          } else {
            res.status(400).json({
              result: "Wrong password",
            });
          }
        });
      } else {
        res.status(400).json({
          result: "Email not found",
        });
      }
    }
  } catch {
    res.status(400).json({
      result: "Login Failed",
    });
  }
});

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

router.route("/update_member").post(async (req, res) => {
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

    const old_query = { member_id: member_id };

    returnHashedPassowrd(password)
      .then((hashedPassword) => {
        const new_data = {
          member_id,
          first_name,
          last_name,
          permission,
          email,
          cell_id,
          cell_designation,
          phone_no,
          password: hashedPassword,
        };
        console.log(new_data);
        Member.updateOne(old_query, new_data, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
        });
      })
      .catch((error) => console.log(error.message));
  } catch (error) {
    res.status(400).json({
      result: "Cannot Update Member",
    });
  }
  res.status(200).json({
    result: "Member Updated",
  });
});

router.route("/delete_member/:member_id").delete(async (req, res) => {
  try {
    const member_id = req.params.member_id;
    console.log(member_id);
    await Member.deleteOne({ member_id });
    const old_query = {};
    const new_query = { $pull: { members: { member_id: member_id } } };
    await Committee.updateMany(old_query, new_query);

    const old_query1 = {};
    const new_query1 = { $pull: { members_list: { member_id: member_id } } };
    await Event.updateMany(old_query1, new_query1);
    console.log("No error here bro");
    res.status(200).json({
      result: "Member deleted",
    });
  } catch (error) {
    res.status(400).json({
      result: "Failed to delete member",
    });
  }
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
