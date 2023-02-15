import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";

const backendURL = "http://localhost:5000/api/event";
const backendURL_for_venue = "http://localhost:5000/api/venue";
const backendURL_for_member = "http://localhost:5000/api/auth";

// let start_options = null;
const theme = createTheme();

const timeslot_length = 30; //in minutes
const timeslot_start_time = "09:00";
const timeslot_end_time = "18:00";

// {
//     "event_id":"000",
//     "name":"Ceremony",
//     "event_creator_id":"00",
//     "description":"Start of new year",
//     "approval_status":{"$numberInt":"1"},
//      "event_date": dateObj,
//     "start_time":{"$date":{"$numberLong":"1640975400000"}},
//     "end_time":{"$date":{"$numberLong":"1672511400000"}},
//     "expected_attendance":{"$numberInt":"1000"},
//     "actual_attendance":{"$numberInt":"500"},
//     "event_summary":"empty",
//     "available_budget":{"$numberLong":"50000"},
//     "venue_id":"000",
//     "venue_status": 0,
//     "order_id":"O1",
//     "order_status": 0,
//     "canteen_id":"000",
//     "members_list":[{"member_id": "AH01", "member_role": "Presenter"}, {"member_id": "00", "member_role": "Pre"}],
//     "spendings":{"venue": 5000, "canteen": 1000, "other": 200}
// }

class Venue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event_id: "",
      name: "",
      event_creator_id: "",
      description: "",
      approval_status: "",
      event_date: "",
      start_time: "",
      end_time: "",
      expected_attendance: "",
      actual_attendance: "",
      event_summary: "",
      available_budget: "",
      venue_id: "",
      venue_status: "",
      order_id: "",
      order_status: "",
      canteen_id: "",
      members_list: [],
      spendings: {},

      member_id: "",
      member_role: "",
      spendings_venue: "",
      spendings_canteen: "",
      spendings_other: "",
      venue_ids: [],
      member_ids: [],
      free_start_times: [],
      free_end_times: [],
      start_time_options: [],
      end_time_options: [],
      member_counter: 0,
      filters: "null",

      ac: false,
      projector: false,
      internet: false,
      computer: false,
      power_backup: false,
    };
  }

  convert_time_in_minutes(HHMM) {
    console.log(HHMM);
    var tmp = String(HHMM).match(/^(\d+):(\d+)$/);
    console.log(tmp);
    var hours = parseInt(tmp[1], 10);
    var minutes = parseInt(tmp[2], 10);
    var total_mins = 60 * hours + minutes;
    console.log(HHMM, minutes, hours, total_mins);
    return total_mins;
  }

  convert_minutes_to_time(total_mins) {
    var minutes = total_mins % 60;
    var hours = (total_mins - minutes) / 60;
    var HHMM =
      (hours < 10 ? "0" : "") +
      hours.toString() +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes.toString();

    console.log(HHMM, minutes, hours, total_mins);
    return HHMM;
  }

  convert_date_string_to_datetime(ddMMYYY) {
    var tmp = String(ddMMYYY).match(/^(\d+)\/(\d+)\/(\d+)$/);
    var year = tmp[3];
    var month = tmp[2];
    var day = tmp[1];
    return new Date(year + "/" + month + "/" + day);
  }

  handleChangeStartTime_utility_function() {
    if (this.state.start_time) {
      console.log("HEELLO");
      this.setState({ free_end_times: [] });
      var i = this.convert_time_in_minutes(this.state.start_time);
      var e = this.convert_time_in_minutes(timeslot_end_time);
      while (i < e) {
        i += timeslot_length;
        this.state.free_end_times.push(this.convert_minutes_to_time(i));
        if (
          !this.state.free_start_times.includes(this.convert_minutes_to_time(i))
        ) {
          break;
        }
      }
      console.log(this.state.free_start_times);
      console.log(this.state.free_end_times);

      const items = [];
      for (let i = 0; i <= this.state.free_end_times.length; i++) {
        items.push(
          <MenuItem
            key={this.state.free_end_times[i]}
            value={this.state.free_end_times[i]}
          >
            {this.state.free_end_times[i]}
          </MenuItem>
        );
      }
      console.log(items);
      this.setState({ end_time_options: items });
    }
  }

  handleChangeDate_utility_function() {
    console.log("!!!!!!!!!!!!!");
    var newvalue = this.state.event_date;
    this.setState({ free_start_times: [] });
    console.log(typeof newvalue);
    console.log(this.state.event_date);
    const event_date = newvalue.toLocaleDateString();
    console.log(event_date);
    console.log(Date(event_date));

    // try {
    let data_temp = "";
    const occupied_start_times_list = [];
    const occupied_end_times_list = [];

    axios
      .get(`${backendURL_for_venue}/get_venue/${this.state.venue_id}`)
      .then((res) => {
        data_temp = res.data.result;
        console.log(data_temp);
        for (var i = 0; i < data_temp.slots_booked.length; i++) {
          if (
            data_temp.slots_booked[i].event_date == event_date &&
            data_temp.slots_booked[i].event_id != this.state.event_id
          ) {
            console.log(data_temp.slots_booked[i].start_time);
            console.log(data_temp.slots_booked[i].end_time);
            occupied_start_times_list.push(
              data_temp.slots_booked[i].start_time
            );
            occupied_end_times_list.push(data_temp.slots_booked[i].end_time);

            // occupied_start_times_list.push(
            //   parseInt(data_temp.slots_booked[i].start_time.split(":")[0])
            // );
            // occupied_end_times_list.push(
            //   parseInt(data_temp.slots_booked[i].end_time.split(":")[0])
            // );
          }
        }
        console.log(occupied_start_times_list);
        console.log(occupied_end_times_list);
        console.log(this.state.free_start_times);

        var i = this.convert_time_in_minutes(timeslot_start_time);
        var e = this.convert_time_in_minutes(timeslot_end_time);
        while (i < e) {
          if (
            occupied_start_times_list.includes(this.convert_minutes_to_time(i))
          ) {
            console.log("HI");
            i = this.convert_time_in_minutes(
              occupied_end_times_list[
                occupied_start_times_list.indexOf(
                  this.convert_minutes_to_time(i)
                )
              ]
            );
          } else {
            this.state.free_start_times.push(this.convert_minutes_to_time(i));
            i += timeslot_length;
          }
        }
        console.log(this.state.free_start_times);
        let items = [];
        for (let i = 0; i <= this.state.free_start_times.length; i++) {
          items.push(
            <MenuItem
              key={this.state.free_start_times[i]}
              value={this.state.free_start_times[i]}
            >
              {this.state.free_start_times[i]}
            </MenuItem>
          );
        }
        console.log(items);
        this.setState(
          { start_options: items },
          this.handleChangeStartTime_utility_function
        );
        // this.state.start_options items;
      });
  }

  componentDidMount = () => {
    try {
      axios.get(`${backendURL_for_member}/get_members`).then((res) => {
        const data = res.data.result;
        console.log(data);
        this.setState({
          member_ids: data,
        });
      });
      console.log(this.state.member_ids);
    } catch (error) {
      console.log("COMPONENT UPDATE ERROR!!!" + error);
      this.setState({ iserror: true });
    }
    console.log("MOUTED");

    try {
      axios.get(`${backendURL_for_venue}/get_venue_ids/null`).then((res) => {
        const data = res.data.result;
        console.log(data);
        this.setState({
          venue_ids: data,
        });
      });
      console.log(this.state.venue_ids);
    } catch (error) {
      console.log("COMPONENT UPDATE ERROR!!!" + error);
      this.setState({ iserror: true });
    }

    const isUpdate = this.props.isUpdate;
    if (isUpdate) {
      const event_id = window.location.pathname.split("/")[2];
      try {
        axios.get(`${backendURL}/get_event/${event_id}`).then((res) => {
          const data = res.data.result;
          console.log(data);
          this.setState(
            {
              event_id: data.event_id,
              name: data.name,
              event_creator_id: data.event_creator_id,
              description: data.description,
              approval_status: data.approval_status,
              event_date: this.convert_date_string_to_datetime(data.event_date),
              // start_time: new Date(data.start_time),
              // end_time: new Date(data.end_time),
              start_time: data.start_time,
              end_time: data.end_time,
              expected_attendance: data.expected_attendance,
              actual_attendance: data.actual_attendance,
              event_summary: data.event_summary,
              available_budget: data.available_budget,
              venue_id: data.venue_id,
              venue_status: data.venue_status,
              order_id: data.order_id,
              order_status: data.order_status,
              canteen_id: data.canteen_id,
              members_list: data.members_list,
              spendings_canteen: data.spendings.canteen,
              spendings_venue: data.spendings.venue,
              spendings_other: data.spendings.other,
            },
            this.handleChangeDate_utility_function
          );
          // console.log(data.event_date);
        });
        // const evt = {
        //   target: { name: "event_date", value: this.state.event_date },
        // };
        // console.log("changed");

        // this.props.handleChangeDate(evt);
        console.log(this.state.event_date);
        // this.handleChangeDate_utility_function(this.state.event_date);
      } catch (error) {
        console.log("COMPONENT UPDATE ERROR" + error);
        this.setState({ iserror: true });
      }
    }
  };

  validateForm = () => {
    console.log("Validating");
    this.setState({ iserror: false });
  };

  handleSubmit = async (event) => {
    this.validateForm();
    event.preventDefault();
    const isUpdate = this.props.isUpdate;

    // const members_arr = [];
    // const obj = {
    //   member_id: this.state.member_id,
    //   member_role: this.state.member_role,
    // };
    // members_arr.push(obj);
    // console.log(obj);
    // console.log(members_arr);
    // console.log(this.state.members_list);

    // if (this.state.members_list.length == 0) {
    //   console.log("inside if");
    //   await this.setState({ members_list: members_arr });
    // } else {
    //   console.log("Inside else");
    //   await this.setState({
    //     members_list: [...this.state.members_list, ...members_arr],
    //   });
    // }
    console.log(this.state.members_list);

    const spendings_obj = {
      venue: this.state.spendings_venue,
      canteen: this.state.spendings_canteen,
      other: this.state.spendings_other,
    };
    await this.setState({ spendings: spendings_obj });

    console.log(this.state.spendings);
    console.log(this.state.members_list);

    const data = {
      event_id: this.state.event_id,
      name: this.state.name,
      event_creator_id: this.state.event_creator_id,
      description: this.state.description,
      approval_status: this.state.approval_status,
      event_date: this.state.event_date.toLocaleDateString(),
      // start_time: this.state.start_time.toLocaleTimeString(),
      // end_time: this.state.end_time.toLocaleTimeString(),
      start_time: this.state.start_time,
      end_time: this.state.end_time,

      expected_attendance: this.state.expected_attendance,
      actual_attendance: this.state.actual_attendance,
      event_summary: this.state.event_summary,
      available_budget: this.state.available_budget,
      venue_id: this.state.venue_id,
      venue_status: this.state.venue_status,
      order_id: this.state.order_id,
      order_status: this.state.order_status,
      canteen_id: this.state.canteen_id,
      members_list: this.state.members_list,
      spendings: this.state.spendings,
      iserror: false,
    };

    console.log(data.spendings);
    console.log(data.members_list);

    const slot_data = {
      venue_id: this.state.venue_id,
      event_slot: {
        event_id: this.state.event_id,
        event_date: this.state.event_date.toLocaleDateString(),
        // start_time: this.state.start_time.toLocaleTimeString(),
        // end_time: this.state.end_time.toLocaleTimeString(),
        start_time: this.state.start_time,
        end_time: this.state.end_time,
      },
    };
    console.log("======");
    console.log(slot_data);
    const response1 = await axios.post(
      `${backendURL}/add_event_slot`,
      slot_data
    );
    console.log(response1);

    if (isUpdate && this.state.iserror === false) {
      try {
        const response = await axios.post(`${backendURL}/update_event`, data);
        const token = response.data.result.token;
        localStorage.setItem("expeditetoken", token);
        // CHECK HISTORY AND THEN ADD
        // this.props.history.push("./");
      } catch (error) {
        console.log("UPDATE EVENT ERROR" + error);
        this.setState({ iserror: true });
      }
    } else {
      if (this.state.iserror === false) {
        try {
          console.log(data);
          const response = await axios.post(`${backendURL}/add_event`, data);
          const token = response.data.result.token;
          localStorage.setItem("expeditetoken", token);
          console.log(response);
          // CHECK HISTORY THEN ADD
          // this.props.history.push("./");
        } catch (error) {
          console.log("ADD EVENT ERROR" + error);
          this.setState({ iserror: true });
        }
      }
    }
  };

  handleChange = (event) => {
    if (
      event.target.name === "expected_attendance" ||
      event.target.name === "actual_attendance" ||
      event.target.name === "available_budget" ||
      event.target.name === "venue_status" ||
      event.target.name === "order_status" ||
      event.target.name === "spendings_canteen" ||
      event.target.name === "spendings_venue" ||
      event.target.name === "spendings_other"
    ) {
      this.setState({
        [event.target.name]: event.target.value.replace(/\D/, ""),
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleChangeDate = (newvalue) => {
    console.log("IN CHANGE DATE");
    this.setState(
      { event_date: newvalue },
      this.handleChangeDate_utility_function
    );

    // var slots_booked_temp = data_temp.slots_booked;

    // } catch (error) {
    //   console.log("TIME SLOTS GET ERROR" + error);
    //   this.setState({ iserror: true });
    // }
  };
  handleChangeStartTime = (event) => {
    console.log(event.target.value);
    this.setState(
      { start_time: event.target.value.toString() },
      this.handleChangeStartTime_utility_function
    );
  };
  handleChangeEndTime = (event) => {
    console.log(event.target.value);
    this.setState({ end_time: event.target.value.toString() });
  };

  get_venues_list_items() {
    let items = [];
    for (let i = 0; i <= this.state.venue_ids.length; i++) {
      items.push(
        <MenuItem key={this.state.venue_ids[i]} value={this.state.venue_ids[i]}>
          {this.state.venue_ids[i]}
        </MenuItem>
      );
    }
    return items;
  }

  get_members_list_items() {
    let items = [];
    for (let i = 0; i <= this.state.member_ids.length; i++) {
      items.push(
        <MenuItem
          key={this.state.member_ids[i]}
          value={this.state.member_ids[i]}
        >
          {this.state.member_ids[i]}
        </MenuItem>
      );
    }
    return items;
  }

  get_start_times_list_items() {
    let items = [];
    console.log(this.state.free_start_times);
    for (let i = 0; i <= this.state.free_start_times.length; i++) {
      items.push(
        <MenuItem
          key={this.state.free_start_times[i]}
          value={this.state.free_start_times[i]}
        >
          {this.state.free_start_times[i]}
        </MenuItem>
      );
    }
    console.log(items);
    return items;
  }

  OnClick_add_new_event_member = () => {
    this.setState({ member_counter: this.state.member_counter + 1 });
    console.log(this.state.member_counter);

    const members_arr = [];
    const obj = {
      member_id: this.state.member_id,
      member_role: this.state.member_role,
    };
    members_arr.push(obj);
    console.log(obj);
    console.log(members_arr);
    console.log(this.state.members_list);

    if (this.state.members_list.length == 0) {
      console.log("inside if");
      this.setState({ members_list: members_arr });
    } else {
      console.log("Inside else");
      this.setState({
        members_list: [...this.state.members_list, ...members_arr],
      });
    }
    console.log(this.state.members_list);
    this.setState({ member_id: "", member_role: "" });
  };

  handleToggle = (event) => {
    console.log(event.target.name);
    console.log(this.state.ac);
    console.log(event.target.checked);
    this.setState({ [event.target.name]: event.target.checked });
    if (this.state.filters == "null" && event.target.checked) {
      this.setState({
        filters: event.target.name + ";",
      });
    } else if (event.target.checked) {
      this.setState({
        filters: this.state.filters + event.target.name + ";",
      });
    } else if (!event.target.checked) {
      this.setState(
        {
          filters: this.state.filters.replace(event.target.name + ";", ""),
        },
        () => {
          if (this.state.filters == "") {
            this.setState({
              filters: "null",
            });
          }
        }
      );
    }
    console.log(this.state.filters);
  };

  OnClick_apply_filters_to_venue = () => {
    try {
      console.log(this.state.filters);
      axios
        .get(`${backendURL_for_venue}/get_venue_ids/${this.state.filters}`)
        .then((res) => {
          const data = res.data.result;
          console.log(data);
          this.setState({
            venue_ids: data,
          });
        });
      console.log(this.state.venue_ids);
    } catch (error) {
      console.log("Venue Filters get request error" + error);
      this.setState({ iserror: true });
    }
  };

  deleteEventMember = (event) => {
    console.log(event.target.id);
    var arr = this.state.members_list;
    arr.splice(event.target.id, 1);

    this.setState({ members_list: arr });
  };

  render() {
    const isUpdate = this.props.isUpdate;
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <br></br>
            {!isUpdate && this.state.iserror && (
              <Alert severity="error">Check The Details Entered</Alert>
            )}
            <Box component="form" onSubmit={this.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{
                  minLength: 1,
                  maxLength: 16,
                }}
                id="event_id"
                label="Event ID"
                name="event_id"
                autoComplete="event_id"
                autoFocus
                value={this.state.event_id}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{
                  minLength: 1,
                  maxLength: 16,
                }}
                id="name"
                label="Event Name"
                name="name"
                autoComplete="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              {/* <TextField
                margin="normal"
                required
                fullWidth
                id="event_creator_id"
                label="Event Creator Member ID"
                name="event_creator_id"
                autoComplete="event_creator_id"
                value={this.state.event_creator_id}
                onChange={this.handleChange}
              /> */}
              <InputLabel id="event_creator_id1">Event Creator ID</InputLabel>
              <Select
                margin="normal"
                required
                fullWidth
                labelId="event_creator_id1"
                id="event_creator_id"
                // value={age}
                label="event_creator_id"
                name="event_creator_id"
                value={this.state.event_creator_id}
                onChange={this.handleChange}
              >
                {this.get_members_list_items()}
              </Select>

              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Event Description"
                name="description"
                autoComplete="description"
                value={this.state.description}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="expected_attendance"
                label="Expected Attendance"
                name="expected_attendance"
                type="number"
                autoComplete="expected_attendance"
                value={this.state.expected_attendance}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="actual_attendance"
                label="Actual Attendance"
                name="actual_attendance"
                type="number"
                autoComplete="actual_attendance"
                value={this.state.actual_attendance}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="event_summary"
                label="Event Summary"
                name="event_summary"
                autoComplete="event_summary"
                value={this.state.event_summary}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="available_budget"
                label="Available Budget"
                name="available_budget"
                type="number"
                autoComplete="available_budget"
                value={this.state.available_budget}
                onChange={this.handleChange}
              />

              <FormControlLabel
                label="Venue should have AC"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="large"
                    id="ac"
                    name="ac"
                    checked={this.state.ac}
                    onChange={this.handleToggle}
                  />
                }
              />
              <FormControlLabel
                label="Venue should have Projector"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="normal"
                    id="projector"
                    name="projector"
                    checked={this.state.projector}
                    onChange={this.handleToggle}
                  />
                }
              />
              <FormControlLabel
                label="Venue should have Internet"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="normal"
                    id="internet"
                    name="internet"
                    checked={this.state.internet}
                    onChange={this.handleToggle}
                  />
                }
              />
              <FormControlLabel
                label="Venue should have Computer"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="normal"
                    id="computer"
                    name="computer"
                    checked={this.state.computer}
                    onChange={this.handleToggle}
                  />
                }
              />
              <FormControlLabel
                label="Venue should have Power Backup"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="normal"
                    id="power_backup"
                    name="power_backup"
                    checked={this.state.power_backup}
                    onChange={this.handleToggle}
                  />
                }
              />
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={this.OnClick_apply_filters_to_venue}
              >
                Search Venues
              </Button>

              <InputLabel id="venue_id1">Venue ID</InputLabel>
              <Select
                margin="normal"
                required
                fullWidth
                labelId="venue_id1"
                id="venue_id"
                // value={age}
                label="venue_id"
                name="venue_id"
                value={this.state.venue_id}
                onChange={this.handleChange}
              >
                {this.get_venues_list_items()}
              </Select>
              {/* <TextField
                margin="normal"
                required
                fullWidth
                id="venue_id"
                label="Venue Id"
                name="venue_id"
                autoComplete="venue_id"
                value={this.state.venue_id}
                onChange={this.handleChange}
              /> */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="venue_status"
                label="Venue Status"
                name="venue_status"
                type="number"
                autoComplete="venue_status"
                value={this.state.venue_status}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="order_id"
                label="Order Id"
                name="order_id"
                autoComplete="order_id"
                value={this.state.order_id}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="order_status"
                label="Order Status"
                name="order_status"
                type="number"
                autoComplete="order_status"
                value={this.state.order_status}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="canteen_id"
                label="Canteen Id"
                name="canteen_id"
                type="number"
                autoComplete="canteen_id"
                value={this.state.canteen_id}
                onChange={this.handleChange}
              />
              <TableContainer component={Paper} sx={{ marginBottom: 8 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell>SR. NO.</TableCell>
                      <TableCell align="center">MEMBER ID</TableCell>
                      <TableCell align="right">ROLE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.members_list &&
                      this.state.members_list.map((obj, index) => (
                        // console.log(obj)
                        // console.log(index)
                        <TableRow key={index}>
                          <TableCell component="th" scope="obj">
                            {index + 1}
                          </TableCell>
                          <TableCell align="center">{obj.member_id}</TableCell>
                          <TableCell align="right">{obj.member_role}</TableCell>
                          <TableCell align="right">
                            <Button
                              type="button"
                              variant="contained"
                              color="error"
                              id={index}
                              endIcon={<DeleteIcon />}
                              onClick={this.deleteEventMember}
                              sx={{ mt: 2, mb: 2 }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* <TextField
                margin="normal"
                fullWidth
                id="member_id"
                label="Add Members ID"
                name="member_id"
                autoComplete="member_id"
                value={this.state.member_id}
                onChange={this.handleChange}
              /> */}
              <InputLabel id="member_id1">Member ID</InputLabel>
              <Select
                margin="normal"
                required
                fullWidth
                labelId="member_id1"
                id="member_id"
                // value={age}
                label="Add Members ID"
                name="member_id"
                value={this.state.member_id}
                onChange={this.handleChange}
              >
                {this.get_members_list_items()}
              </Select>
              <TextField
                margin="normal"
                fullWidth
                id="member_role"
                label="Add Members Role"
                name="member_role"
                autoComplete="member_role"
                value={this.state.member_role}
                onChange={this.handleChange}
              />

              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={this.OnClick_add_new_event_member}
              >
                Add Member
              </Button>

              <TextField
                margin="normal"
                required
                fullWidth
                id="spendings_venue"
                label="Spendings On Venue"
                name="spendings_venue"
                type="number"
                autoComplete="spendings_venue"
                value={this.state.spendings_venue}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="spendings_canteen"
                label="Spendings On Canteen"
                name="spendings_canteen"
                type="number"
                autoComplete="spendings_canteen"
                value={this.state.spendings_canteen}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="spendings_other"
                label="Spendings On Other"
                name="spendings_other"
                type="number"
                autoComplete="spendings_other"
                value={this.state.spendings_other}
                onChange={this.handleChange}
              />
              {/* <Container> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Select Date To Book Slot"
                    inputFormat="dd/MM/yyyy"
                    value={this.state.event_date}
                    onChange={this.handleChangeDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <InputLabel id="start_time1">Start Time</InputLabel>
                  <Select
                    margin="normal"
                    required
                    fullWidth
                    labelId="start_time1"
                    id="start_time"
                    // value={age}
                    label="start_time"
                    name="start_time"
                    value={this.state.start_time}
                    onChange={this.handleChangeStartTime}
                    setState
                  >
                    {/* {this.get_start_times_list_items()} */}
                    {this.state.start_options}
                  </Select>
                  {/* <TimePicker
                      label="Start Time"
                      inputFormat="hh:mm a"
                      // ampm={true}
                      value={this.state.start_time}
                      onChange={this.handleChangeStartTime}
                      renderInput={(params) => <TextField {...params} />}
                    /> */}

                  <InputLabel id="end_time1">End Time</InputLabel>
                  <Select
                    margin="normal"
                    required
                    fullWidth
                    labelId="end_time1"
                    id="end_time"
                    // value={age}
                    label="end_time"
                    name="end_time"
                    value={this.state.end_time}
                    onChange={this.handleChangeEndTime}
                  >
                    {this.state.end_time_options}
                    {/* {this.get_event_list_items()} */}
                  </Select>
                  {/* <TimePicker
                      label="End Time"
                      value={this.state.end_time}
                      onChange={this.handleChangeEndTime}
                      renderInput={(params) => <TextField {...params} />}
                    /> */}
                </Stack>
              </LocalizationProvider>
              {/* </Container> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register Venue
              </Button>
            </Box>
          </Box>
          {/* <Container>
            <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          {/* <TableContainer component={Paper} sx={{ marginBottom: 8 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell>EVENT ID</TableCell>
                      <TableCell align="right">DATE</TableCell>
                      <TableCell align="right">START TIME</TableCell>
                      <TableCell align="right">END TIME</TableCell>
                      <TableCell align="right">DELETE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.slots_booked &&
                      this.state.slots_booked.map((slot) => (
                        <TableRow key={slot[3]}>
                          <TableCell component="th" scope="slot">
                            {slot[3]}
                          </TableCell>
                          <TableCell align="right">{slot[0]}</TableCell>
                          <TableCell align="right">{slot[1]}</TableCell>
                          <TableCell align="right">{slot[2]}</TableCell>
                          <TableCell align="right">
                            <Button
                              type="button"
                              variant="contained"
                              color="error"
                              id={slot[3]}
                              endIcon={<DeleteIcon />}
                              onClick={this.deleteSlot}
                              sx={{ mt: 2, mb: 2 }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer> */}
          {/* <Stack spacing={3}>
                <DesktopDatePicker
                  label="Select Date To Book Slot"
                  inputFormat="dd/MM/yyyy"
                  value={this.state.eventDate}
                  onChange={this.handleChangeDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label="Start Time"
                  value={this.state.eventStartTime}
                  onChange={this.handleChangeStartTime}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label="End Time"
                  value={this.state.eventEndTime}
                  onChange={this.handleChangeEndTime}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={this.addSlot}
                sx={{ mt: 3, mb: 2 }}
              >
                Add Slot
              </Button>
            </LocalizationProvider>
          </Container> */}
        </Container>
      </ThemeProvider>
    );
  }
}

export default Venue;
