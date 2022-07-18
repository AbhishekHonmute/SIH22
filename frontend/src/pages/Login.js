import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Formerr from "../components/Formerr";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid Email").required(),
  password: yup.string().required(),
});

const backendURL = "http://localhost:5000/api";

const theme = createTheme();

export default function Login(props) {
  const navigate = useNavigate();

  const toDashboard = () => {
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState("");

  const onsubmithandler = async (formdata) => {
    const data = {
      email: formdata.email,
      password: formdata.password,
    };
    // console.log({
    //   email: data.email,
    //   password: data.password,
    // });

    try {
      const response = await axios.post(`${backendURL}/auth/login`, data);
      const token = response.data.result.token;
      const usertype = response.data.result.usertype;
      console.log(token, usertype);
      localStorage.setItem("expeditetoken", token);
      localStorage.setItem("expediteusertype", usertype);
      setError("");
      toDashboard();
    } catch (err) {
      console.log("Login failed");
      setError("Login failed");
    }
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
          <Formerr error={error} />
          <Box
            component="form"
            onSubmit={handleSubmit(onsubmithandler)}
            sx={{ mt: 1 }}
          >
            <TextField
              {...register("email")}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              {...register("password")}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
