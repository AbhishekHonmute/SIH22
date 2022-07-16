import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const backendURL = "http://localhost:5000/add_venue";

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
      rating: "",
      address: "",
      slots_booked: "",
      
      ac: false,
      projector: false,
      internet: false,
      computer: false,
      power_backup: false,
    };
  }

  render() {
    const handleSubmit = async (event) => {
      event.preventDefault();
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
        address: this.state.address,
        slots: this.state.slots,
        iserror: false,
      };
      console.log({
        
        venue_id: data.state.venue_id,
        name: data.state.name,
        rent: data.state.rent,
        capacity: data.state.capacity,
        ac: data.state.ac,
        projector: data.state.projector,
        internet: data.state.internet,
        computer: data.state.computer,
        power_backup: data.state.power_backup,
        email: data.state.email,
        password: data.state.password,
        address: data.state.address,
        slots: data.state.slots,
      });

      try {
        const response = await axios.post(`${backendURL}/add_venue`, data);
        const token = response.data.result.token;
        localStorage.setItem("expeditetoken", token);
        this.props.history.push("./");
      } catch (error) {
        this.state.iserror = true;
      }
    };

    const handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value,
      });
    };

    const handleToggle = (event) => {
      this.setState({
        [event.target.name]: event.target.checked,
      });
      console.log(event.target.name + " " + event.target.checked);
    };

    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
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
            {this.state.iserror && (
              <Alert severity="error">Can't Add Venue Check The Details Entered</Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Venue Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={this.state.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="rent"
                label="Venue rent"
                name="rent"
                autoComplete="rent"
                value={this.state.rent}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="capacity"
                label="Venue capacity"
                name="capacity"
                autoComplete="capacity"
                value={this.state.capacity}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="Venue Address"
                name="address"
                autoComplete="address"
                value={this.state.address}
                onChange={handleChange}
              />              
              <TextField
                margin="normal"
                required
                fullWidth
                id="slots"
                label="Slots Available At Venue"
                name="slots"
                autoComplete="slots"
                value={this.state.slots}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={handleChange}
              />
              <FormControlLabel
                label="Venue Has AC"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="large"
                    id="ac"
                    name="ac"
                    checked={this.state.ac}
                    onChange={handleToggle}
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
                    onChange={handleToggle}
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
                    onChange={handleToggle}
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
                    onChange={handleToggle}
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
                    onChange={handleToggle}
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
        </Container>
      </ThemeProvider>
    );
  }
}

export default Venue;
