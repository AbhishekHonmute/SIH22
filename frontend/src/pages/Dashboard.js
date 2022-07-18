import React, { Component } from "react";
import { Typography } from "@mui/material";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (localStorage.getItem("expeditetoken") != null) {
      const usertype = localStorage.getItem("expediteusertype");
      return <Typography>Dashboard : {usertype} Logged In </Typography>;
    } else {
      return <Typography>Dashboard : Not Logged In</Typography>;
    }
  }
}

export default Dashboard;
