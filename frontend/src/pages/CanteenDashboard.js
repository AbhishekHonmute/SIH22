import React, { Component } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Menufooditem from "../components/MenufoodItem";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const Img = styled("img")({
	margin: "auto",
	display: "block",
	maxWidth: "100%",
	maxHeight: "100%",
});

const backendURL = "http://localhost:5000/api/canteen";
const backendVenueURL = "http://localhost:5000/api/venue";

class CanteenDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			canteen_id: "",
			name: "",
			email: "",
			password: "",
			rating: "",
			counter: 0,
			menu: [],
			serviceable_to: [],
			allvenue: [],
			phone_no: "",
			is_profile_editable: false,
			users: "",
			showmenu: false,
		};
	}

	handleToggle = (venue_id) => {
		if (this.state.is_profile_editable) {
			console.log(venue_id);
			const allvenue = this.state.allvenue;
			const serviceable_to = [];
			for (let j = 0; j < allvenue.length; j++) {
				if (venue_id === this.state.allvenue[j][0]) {
					allvenue[j][2] = !this.state.allvenue[j][2];
				}
			}

			this.setState({ allvenue: allvenue });
			for (let j = 0; j < this.state.allvenue.length; j++) {
				if (this.state.allvenue[j][2]) {
					serviceable_to.push(this.state.allvenue[j][0]);
				}
			}

			this.setState({ serviceable_to: serviceable_to });
			console.log(serviceable_to);
		}
	};

	handleEditProfile = async (event) => {
		console.log("Profile Edit Request");
		this.setState({ is_profile_editable: true });
	};

	handleShowMenucard = async (event) => {
		this.setState({ showmenu: !this.state.showmenu });
	};

	handleChange = async (event) => {
		switch (event.target.name) {
			case "phone_no":
				this.setState({
					[event.target.name]: event.target.value.replace(/\D/g, ""),
				});
				break;

			default:
				this.setState({
					[event.target.name]: event.target.value,
				});
		}
	};

	handleAddfooditem = async (event) => {
    console.log(this.state.counter);
    
		const menuId = `${this.state.canteen_id}M${this.state.counter}`;
		console.log(menuId);

		this.state.menu.unshift([menuId, "Edit New Menu", "0", true]);

		console.log(this.state.menu);
		this.setState({ counter: this.state.counter + 1 });
	};

	handleSaveProfile = async (event) => {
		this.setState({ is_profile_editable: false });
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
			const response = await axios.post(`${backendURL}/update_canteen`, data);
			const token = response.data.result.token;
			localStorage.setItem("expeditetoken", token);
			this.props.history.push("./");
		} catch (error) {
			this.state.iserror = true;
		}
	};

	componentDidMount() {
		const canteen_id = window.location.pathname.split("/")[2];
		axios.get(`${backendURL}/get_canteen/${canteen_id}`).then((resp) => {
			const canteen = resp.data.result;
			console.log("Hiii");
			const MenuCard = canteen.menu;

			console.log(typeof MenuCard);
			this.setState({ canteen_id: canteen.canteen_id });
			this.setState({ name: canteen.name });
			this.setState({ email: canteen.email });
			this.setState({ password: canteen.password });
			this.setState({ counter: canteen.counter });
			this.setState({ menu: MenuCard });
			this.setState({ serviceable_to: canteen.serviceable_to });
			this.setState({ phone_no: canteen.phone_no });
		});

		axios.get(`${backendVenueURL}/get_venues`).then((resp) => {
			const venues = resp.data.result;
			const allvenue = [];
			for (let i = 0; i < Object.keys(venues).length; i++) {
				console.log(venues[i].id);
				allvenue.push([venues[i].id, venues[i].name, false]);
			}

			for (let i = 0; i < this.state.serviceable_to.length; i++) {
				for (let j = 0; j < allvenue.length; j++) {
					if (this.state.serviceable_to[i] === allvenue[j][0]) {
						allvenue[j][2] = true;
					}
				}
			}

			console.log(allvenue);
			this.setState({ allvenue: allvenue });
		});

		console.log(this.state.menu);
	}
	render() {
		return (
			<Paper
				sx={{
					p: 2,
					margin: "auto",
					maxWidth: 800,
					flexGrow: 1,
					backgroundColor: (theme) =>
						theme.palette.mode === "dark" ? "#1A2027" : "#fff",
				}}
				elevation={24}
			>
				<Grid container spacing={8}>
					<Grid item>
						<ButtonBase sx={{ width: 200, height: 200 }}>
							<Img
								alt="complex"
								src="https://img.freepik.com/premium-vector/school-canteen-interior-flat-illustration_318844-69.jpg"
							/>
						</ButtonBase>
					</Grid>
					<Grid item xs={12} sm container>
						<Grid item xs container direction="column" spacing={2}>
							<Grid item xs>
								<Typography
									gutterBottom
									variant="body1"
									component="div"
									suppressContentEditableWarning={
										this.state.is_profile_editable
									}
									contentEditable={this.state.is_profile_editable}
									onChange={this.handleChange}
								>
									{this.state.is_profile_editable ? (
										<TextField
											id="standard-basic"
											label="name"
											name="name"
											variant="standard"
											value={this.state.name}
											onChange={this.handleChange}
										/>
									) : (
										<>{this.state.name}</>
									)}
								</Typography>

								<Typography
									gutterBottom
									variant="subtitle2"
									component="div"
									suppressContentEditableWarning={
										this.state.is_profile_editable
									}
									contentEditable={this.state.is_profile_editable}
									onChange={this.handleChange}
								>
									{this.state.is_profile_editable ? (
										<TextField
											id="standard-basic"
											label="phone_no"
											name="phone_no"
											variant="standard"
											value={this.state.phone_no}
											onChange={this.handleChange}
										/>
									) : (
										<>{this.state.phone_no}</>
									)}
								</Typography>

								<Typography
									gutterBottom
									variant="subtitle1"
									component="div"
									suppressContentEditableWarning={
										this.state.is_profile_editable
									}
									contentEditable={this.state.is_profile_editable}
									onChange={this.handleChange}
								>
									{this.state.is_profile_editable ? (
										<TextField
											id="standard-basic"
											label="email"
											name="email"
											variant="standard"
											value={this.state.email}
											onChange={this.handleChange}
										/>
									) : (
										<>{this.state.email}</>
									)}
								</Typography>

								<Typography
									gutterBottom
									variant="inherit"
									component="div"
									suppressContentEditableWarning={
										this.state.is_profile_editable
									}
									contentEditable={this.state.is_profile_editable}
									onChange={this.handleChange}
								>
									{this.state.canteen_id}
								</Typography>
							</Grid>
							<Grid>
								{this.state.is_profile_editable ? (
									<Box>
										{this.state.allvenue.map((venue) => (
											<Grid key={venue[0]} item>
												<FormControlLabel
													control={
														<Switch
															checked={venue[2]}
															onClick={() => this.handleToggle(venue[0])}
															value="active"
															id={venue[0]}
															inputProps={{
																"aria-label": "secondary checkbox",
															}}
														/>
													}
													label={venue[1]}
												/>
											</Grid>
										))}
									</Box>
								) : (
									<></>
								)}
							</Grid>

							<Grid item>
								{this.state.is_profile_editable ? (
									<Button
										variant="outlined"
										color="success"
										onClick={this.handleSaveProfile}
									>
										Save
									</Button>
								) : (
									<Button variant="outlined" onClick={this.handleEditProfile}>
										<EditIcon />
									</Button>
								)}
							</Grid>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1" component="div">
								{this.state.rating}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				{this.state.showmenu ? (
					<Grid>
						<Button
							variant="outlined"
							color="success"
							onClick={this.handleShowMenucard}
						>
							Hide MenuCard
						</Button>

						<Button onClick={this.handleAddfooditem}>
							<PostAddIcon></PostAddIcon> Add Menu
						</Button>
					</Grid>
				) : (
					<Grid>
						<Button
							variant="outlined"
							color="success"
							onClick={this.handleShowMenucard}
						>
							Show MenuCard
						</Button>
					</Grid>
				)}

				{this.state.counter > 1 && this.state.showmenu ? (
					<Box
						sx={{
							width: 600,
							margin: 10,
							backgroundColor: "primary.dark",
							"&:hover": {
								backgroundColor: "primary.main",
								opacity: [0.7, 0.8, 0.9],
							},
						}}
					>
						<Typography variant="h2" align="center">
							{this.state.name}
						</Typography>
						<Grid>
							{this.state.menu.map((fooditem) => (
								<Menufooditem
									key={fooditem[0]}
									item={fooditem}
									canteen_id={this.state.canteen_id}
								></Menufooditem>
							))}
						</Grid>
					</Box>
				) : (
					<></>
				)}
			</Paper>
		);
	}
}

export default CanteenDashboard;
