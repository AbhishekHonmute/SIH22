import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormControlLabel from "@mui/material/FormControlLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';

const backendURL = "http://localhost:5000/api/venue";

const theme = createTheme();

class Venue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue_id: "",
      name: "",
      rent: "",
      capacity: "",
      email: "",
      password: "",
      oldpassword: "",
      newpassword: "",
      rating: "",
      address: "",
      slots_booked: [], //4 : Date : startTime EndTime EventID
      
      ac: false,
      projector: false,
      internet: false,
      computer: false,
      power_backup: false,

      iserror: false,
      
      eventDate: new Date(),
      eventStartTime: new Date(),
      eventEndTime: new Date(),
    };
  }
  componentDidMount = () => {
    const isUpdate = this.props.isUpdate;
    if(isUpdate) {
      const venue_id = window.location.pathname.split("/")[2];
      try{
        axios.get(`${backendURL}/get_venue/${venue_id}`)
        .then(res => {
          const data = res.data.result;
          this.setState({
            venue_id: data.venue_id,
            name: data.name,
            rent: data.rent,
            capacity: data.capacity,
            ac: data.ac,
            projector: data.projector,
            internet: data.internet,
            computer: data.computer,
            power_backup: data.power_backup,
            email: data.email,
            password: data.password,
            oldpassword: "",
            newpassword: "",
            address: data.address,
            slots_booked: data.slots_booked,
          });
        });
      }
      catch (error) {
        console.log("COMPONENT UPDATE ERROR" + error);
        this.setState({iserror: true});
      }
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const isUpdate = this.props.isUpdate;
    const data = {
      venue_id: this.state.venue_id,
      name: this.state.name,
      rent: this.state.rent,
      capacity: this.state.capacity,
      ac: this.state.ac,
      projector: this.state.projector,
      internet: this.state.internet,
      computer: this.state.computer,
      power_backup: this.state.power_backup,
      email: this.state.email,
      password: this.state.password,
      oldpassword: this.state.oldpassword,
      newpassword: this.state.newpassword,
      address: this.state.address,
      slots_booked: this.state.slots_booked,
      rating: this.state.rating,
      iserror: false,
    };
    // console.log({
    //   venue_id: data.venue_id,
    //   name: data.name,
    //   rent: data.rent,
    //   capacity: data.capacity,
    //   ac: data.ac,
    //   projector: data.projector,
    //   internet: data.internet,
    //   computer: data.computer,
    //   power_backup: data.power_backup,
    //   email: data.email,
    //   address: data.address,
    // });
    if(isUpdate && this.state.iserror === false) {
      try{
        const response = await axios.post(`${backendURL}/update_venue`, data);
        const token = response.data.result.token;
        localStorage.setItem("expeditetoken", token);
        // CHECK HISTORY AND THEN ADD
        // this.props.history.push("./");
      }
      catch (error) {
        console.log("UPDATE VENUE ERROR" + error);
        this.setState({iserror: true});
      }
    }
    else {
      if(this.state.iserror === false) {
        try{
          const response = await axios.post(`${backendURL}/add_venue`, data);
          const token = response.data.result.token;
          localStorage.setItem("expeditetoken", token);
          // CHECK HISTORY THEN ADD
          // this.props.history.push("./");
        }
        catch (error) {
          console.log("ADD VENUE ERROR" + error);
          this.setState({iserror: true});
        }
      }
    }
  };

  handleChange = (event) => {
    if(event.target.name === "rent" || event.target.name === "capacity" || event.target.name === "slots") {
      this.setState({
        [event.target.name]: event.target.value.replace(/\D/,''),
      });
    }
    else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleChangeDate = (newvalue) => {
    this.setState({eventDate: newvalue});
  }
  handleChangeStartTime = (newvalue) => {
    this.setState({eventStartTime: newvalue});
  }
  handleChangeEndTime = (newvalue) => {
    this.setState({eventEndTime: newvalue});
  }
  handleToggle = (event) => {
    this.setState({
      [event.target.name]: event.target.checked,
    });
  };

  addSlot = () => {
    var arr = {}
    // Get From SomeWhere
    let r = (Math.random() + 1).toString(36).substring(7);
    arr['eventId'] = "EVENTID : " + r;
    arr['eventDate'] = this.state.eventDate.toLocaleDateString();
    arr['eventStartTime'] = this.state.eventStartTime.toLocaleTimeString();
    arr['eventEndTime'] = this.state.eventEndTime.toLocaleTimeString();
    if(this.state.slots_booked.length == null) {
      this.setState({slots_booked: [arr,]});
    }
    else {
      this.setState({slots_booked: [...this.state.slots_booked, arr]});
    }
  }

  deleteSlot = (event) => {
    console.log(event.target.id);
    var arr = this.state.slots_booked;
    for(var i = 0; i < arr.length; i++) {
      if(arr[i]['eventId'] === event.target.id) {
        arr.splice(i, 1);
        break;
      }
    }
    this.setState({slots_booked: arr});
  }

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
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{ 
                  minLength: 1,
                  maxLength: 16
                }}
                id="venue_id"
                label="Venue ID"
                name="venue_id"
                autoComplete="venue_id"
                autoFocus
                value={this.state.venue_id}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{ 
                  minLength: 1,
                  maxLength: 16
                }}
                id="name"
                label="Venue Name"
                name="name"
                autoComplete="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="rent"
                label="Venue rent"
                name="rent"
                type="number"
                autoComplete="rent"
                value={this.state.rent}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="capacity"
                type="number"
                label="Venue capacity"
                name="capacity"
                autoComplete="capacity"
                value={this.state.capacity}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{ 
                  minLength: 1,
                  maxLength: 32
                }}
                id="address"
                label="Venue Address"
                name="address"
                autoComplete="address"
                value={this.state.address}
                onChange={this.handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              {/* Currently Cant Update Password */}
              {!isUpdate &&
              <TextField
                margin="normal"
                required
                fullWidth
                inputProps={{ 
                  minLength: 8,
                  maxLength: 15
                }}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={this.handleChange}
              /> 
              }
              {isUpdate &&
              <TextField
                margin="normal"
                fullWidth
                inputProps={{ 
                  minLength: 8,
                  maxLength: 15
                }}
                name="oldpassword"
                label="Old Password"
                type="password"
                id="oldpassword"
                value={this.state.oldpassword}
                onChange={this.handleChange}
              />
              }
              {isUpdate &&
              <TextField
                margin="normal"
                fullWidth
                inputProps={{ 
                  minLength: 8,
                  maxLength: 15
                }}
                name="newpassword"
                label="New Password"
                type="password"
                id="newpassword"
                value={this.state.newpassword}
                onChange={this.handleChange}
              />
              }
              <FormControlLabel
                label="Venue Has AC"
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
                label="Venue Has Projector"
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
                label="Venue Has Internet"
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
                label="Venue Has Computer"
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
                label="Venue Has Power Backup"
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
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register Venue
              </Button>
            </Box>
          </Box>
          <Container>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TableContainer component={Paper} sx={{ marginBottom:8 }}>
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
                  {this.state.slots_booked && this.state.slots_booked.map((slot) => (
                    <TableRow key={slot['eventId']}>
                      <TableCell component="th" scope="slot">
                        {slot['eventId']}
                      </TableCell>
                      <TableCell align="right">{slot['eventDate']}</TableCell>
                      <TableCell align="right">{slot['eventStartTime']}</TableCell>
                      <TableCell align="right">{slot['eventEndTime']}</TableCell>
                      <TableCell align="right"> 
                        <Button
                          type="button"
                          variant="contained"
                          color="error"
                          id={slot['eventId']}
                          endIcon={<DeleteIcon />}
                          onClick={this.deleteSlot}
                          sx={{mt: 2, mb: 2}}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack spacing={3}>
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
              sx={{mt: 3, mb: 2}}
            >
              Add Slot
            </Button>
            </LocalizationProvider>
          </Container>
        </Container>
      </ThemeProvider>
    );
  }
}

export default Venue;
