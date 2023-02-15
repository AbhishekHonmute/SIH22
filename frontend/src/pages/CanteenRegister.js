import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const backendURL = "http://localhost:5000/api/canteen";


const theme = createTheme();

class CanteenRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canteen_id: "",
      name: "",
      email: "",
      password: "",
      rating: "",
      counter:1,
      menu: [],
      serviceable_to: [],
      phone_no: "",
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      canteen_id: this.state.canteen_id,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      rating: this.state.rating,
      counter: this.state.counter,
      menu: this.state.menu,
      serviceable_to: this.state.serviceable_to,
      phone_no: this.state.phone_no,
    };
    console.log({
      
      canteen_id: this.state.canteen_id,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      rating: this.state.rating,
      counter: this.state.counter,
      menu: this.state.menu,
      serviceable_to: this.state.serviceable_to,
      phone_no: this.state.phone_no,
    });

    try {
      const response = await axios.post(`${backendURL}/add_canteen`, data);
      const token = response.data.result.token;
      localStorage.setItem("expeditetoken", token);
      this.props.history.push("./");
    } catch (error) {
      this.state.iserror = true;
    }
  };

  handleChange = (event) => {
    switch(event.target.name){
      case 'phone_no': 
        this.setState({
          [event.target.name]: event.target.value.replace(/\D/g, ''),
        });
        break;

      default:
        this.setState({
          [event.target.name]: event.target.value,
        });

    }
    
  };

  handleToggle = (event) => {
    this.setState({
      [event.target.name]: event.target.checked,
    });
    console.log(event.target.name + " " + event.target.checked);
  };

  render() {
    
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
              Register Canteen
            </Typography>
            <br></br>
            {this.state.iserror && (
              <Alert severity="error">Can't Add Canteen Check The Details Entered</Alert>
            )}
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="canteen_id"
                label="Create Canteen ID"
                name="canteen_id"
                autoComplete="id"
                autoFocus
                value={this.state.canteen_id}
                onChange={this.handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="phone_no"
                label="Contact Number"
                name="phone_no"
                autoComplete="phone_no"
                autoFocus
                value={this.state.phone_no}
                onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                onChange={this.handleChange}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register Canteen
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default CanteenRegister;
