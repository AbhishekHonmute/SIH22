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

const backendURL = "http://localhost:5000/api/fooditem";

const theme = createTheme();

class Fooditem extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
        name: "",
        description: "",
        price: 0,
        type: "",
        is_veg: false,
        is_fastfood: false,
        is_pricefixed: false,  
    };
  }

  render() {
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = {
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        type: this.state.type,
        is_veg: this.state.is_veg,
        is_fastfood: this.state.is_fastfood,
        is_pricefixed: this.state.is_pricefixed,
        
      };
      console.log({
        
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        type: this.state.type,
        is_veg: this.state.is_veg,
        is_fastfood: this.state.is_fastfood,
        is_pricefixed: this.state.is_pricefixed,
      });

      try {
        const response = await axios.post(`${backendURL}/add_fooditem`, data);
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
                label="Food Item Name"
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
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                value={this.state.description}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                autoComplete="price"
                value={this.state.price}
                onChange={handleChange}
                disabled={this.state.is_pricefixed}
              />
              
              <FormControlLabel
                label="Veg"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="large"
                    id="is_veg"
                    name="is_veg"
                    checked={this.state.is_veg}
                    onChange={handleToggle}
                  />
                }
              />
              <FormControlLabel
                label="Fastfood"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="normal"
                    id="is_fastfood"
                    name="is_fastfood"
                    checked={this.state.is_fastfood}
                    onChange={handleToggle}
                  />
                }
              />
              <FormControlLabel
                label="Price Fixed"
                labelPlacement="start"
                control={
                  <Checkbox
                    margin="normal"
                    id="is_pricefixed"
                    name="is_pricefixed"
                    checked={this.state.is_pricefixed}
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

export default Fooditem;
