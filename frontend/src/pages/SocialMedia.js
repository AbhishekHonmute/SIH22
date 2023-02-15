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

import HelmetMetaData from "../components/HelmetMetaData/HelmetMetaData";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const theme = createTheme();

class SocialMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      text: "",
      quote: "",
      hashtag: "",
      description: "",
    };
  }

  render() {
    const handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value,
      });
    };

    return (
      <ThemeProvider theme={theme}>
        <HelmetMetaData></HelmetMetaData>
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
              Share On Socials
            </Typography>
            <br></br>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="url"
                label="URL to share"
                name="url"
                autoFocus
                value={this.state.url}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="text"
                label="Tweet(for twitter)"
                type="text"
                id="text"
                value={this.state.text}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="hashtag"
                label="Hashtag(exclude #)"
                type="hashtag"
                id="hashtag"
                value={this.state.hashtag}
                onChange={handleChange}
              />

              <FacebookShareButton
                url={this.state.url}
                hashtag={"#" + this.state.hashtag}
              >
                <FacebookIcon size={50} round={true} />
              </FacebookShareButton>
              <TwitterShareButton
                url={this.state.url}
                title={this.state.text}
                quote={"HELLO"}
                hashtags={[this.state.hashtag]}
              >
                <TwitterIcon size={50} round={true} />
              </TwitterShareButton>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default SocialMedia;
