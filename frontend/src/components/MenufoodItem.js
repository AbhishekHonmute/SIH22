import { React, Component } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import veg from "../images/veg.jpeg";
import non_veg from "../images/non_veg.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import axios from "axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
const Img = styled("img")({
	margin: "auto",
	display: "block",
	maxWidth: "100%",
	maxHeight: "100%",
});
const backendURL = "http://localhost:5000/api/canteen";
class Menufooditem extends Component {
	constructor(props) {
		super(props);
		// console.log("ITEM ID " + props.item.id);
		// console.log("ITEM NAME " + props.item.name);
		// console.log("ITEM PRICE " + props.item.price);
		// console.log("ITEM ISVEG " + props.item.isVeg);

		this.state = {
			menuId: "",
			menuName: "",
			price: "",
			isVeg: false,
			isUpdate: false,
			canteen_id: "",
			iserror: false,
		};
	}

	handleEdit = async (event) => {
		// console.log("Profile Edit Request");
		this.setState({ isUpdate: true });
	};

	handleChange = async (event) => {
		switch (event.target.name) {
			case "price":
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

	handleCheckbox = async (event) => {
		// console.log(event.target.checked);
		if (event.target.checked === true) {
			this.setState({ isVeg: true });
		} else {
			this.setState({ isVeg: false });
		}
	};

	handleSave = async (event) => {
		this.setState({ isUpdate: false });
		axios
			.get(`${backendURL}/get_canteen/${this.state.canteen_id}`)
			.then((resp) => {
				const canteen = resp.data.result;

				let original_menu = canteen.menu;
				let new_menu = true;
				// console.log(original_menu);
				for (let i = 0; i < original_menu.length; i++) {
					if (original_menu[i].id === this.state.menuId) {
						original_menu[i].name = this.state.menuName;
						original_menu[i].price = this.state.price;
						original_menu[i].isVeg = this.state.isVeg;
						new_menu = false;
						break;
					}
				}
				if (new_menu) {
					const newMenu = {};
					let counter = canteen.counter;
					newMenu.id = this.state.menuId;
					newMenu.name = this.state.menuName;
					newMenu.price = this.state.price;
					newMenu.isVeg = this.state.isVeg;
					original_menu.push(newMenu);
					canteen.counter = counter + 1;
				}
				canteen.menu = original_menu;
				const data = canteen;
				try {
					axios
						.post(`${backendURL}/update_canteen`, data)
						.then((res) => {
							const token = res.data.result.token;
							localStorage.setItem("expeditetoken", token);
							// this.props.history.push("./");
						})
						.catch((err) => {
							console.log(err);
						});
				} catch (error) {
					this.state.iserror = true;
				}
			});
	};

	handleDelete = async (event) => {
		//this.setState({iserror: false});
		axios
			.get(`${backendURL}/get_canteen/${this.state.canteen_id}`)
			.then((resp) => {
				const canteen = resp.data.result;
				const original_menu = canteen.menu;
				const updated_menu = [];
				for (let i = 0; i < original_menu.length; i++) {
					if (original_menu[i].id !== this.state.menuId) {
						updated_menu.push(original_menu[i]);
					}
				}
				canteen.menu = updated_menu;
				const data = canteen;
				// console.log(data);
				try {
					axios
						.post(`${backendURL}/update_canteen`, data)
						.then((res) => {
							const token = res.data.result.token;
							localStorage.setItem("expeditetoken", token);
							// this.props.history.push("./");
						})
						.catch((err) => {
							this.setState({ iserror: true });
							console.log(err);
						});
				} catch (error) {
					this.setState({ iserror: false });
				}
			});
	};

	handleToggle = () => {
		this.setState({ isVeg: !this.state.isVeg });
	};
	componentDidMount() {
		this.setState({ menuId: this.props.item.id });
		this.setState({ menuName: this.props.item.name });
		this.setState({ price: this.props.item.price });
		this.setState({ isVeg: this.props.item.isVeg });
		this.setState({ canteen_id: this.props.canteen_id });
	}

	render() {
		if (this.props.error) {
			return null;
		}
		return (
			<Paper
				sx={{
					p: 2,
					margin: 5,
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
								src="https://www.deputy.com/uploads/2018/10/The-Most-Popular-Menu-Items-That-You-should-Consider-Adding-to-Your-Restaurant_Content-image1-min-1024x569.png"
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
									contentEditable={this.state.isUpdate}
									suppressContentEditableWarning={this.state.isUpdate}
								>
									{this.state.isUpdate ? (
										<TextField
											id="standard-basic"
											label="menuName"
											name="menuName"
											variant="standard"
											value={this.state.menuName}
											onChange={this.handleChange}
										/>
									) : (
										<>{this.state.menuName}</>
									)}
								</Typography>

								<Typography
									gutterBottom
									variant="subtitle2"
									component="div"
									contentEditable={this.state.isUpdate}
									suppressContentEditableWarning={this.state.isUpdate}
								>
									{this.state.isUpdate ? (
										<TextField
											id="standard-basic"
											label="price"
											name="price"
											variant="standard"
											value={this.state.price}
											onChange={this.handleChange}
										/>
									) : (
										<>{this.state.price}</>
									)}
								</Typography>

								<Typography
									gutterBottom
									variant="subtitle1"
									component="div"
									contentEditable={this.state.isUpdate}
									suppressContentEditableWarning={this.state.isUpdate}
								>
									{this.state.isUpdate ? (
										<FormControlLabel
											control={
												<Switch
													checked={this.state.isVeg}
													value="active"
													onClick={() => this.handleToggle()}
													inputProps={{ "aria-label": "secondary checkbox" }}
												/>
											}
											label="Veg"
										/>
									) : (
										<>{this.state.isVeg}</>
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
								>
									{this.state.is_profile_editable ? (
										<TextField
											id="standard-basic"
											label="canteen_id"
											name="canteen_id"
											variant="standard"
											value={this.state.canteen_id}
											onChange={this.handleChange}
										/>
									) : this.state.menuId === "" ? (
										""
									) : (
										<>{this.state.menuId}</>
									)}
								</Typography>
							</Grid>
							<Grid item>
								{this.state.isUpdate ? (
									<Button
										variant="outlined"
										color="success"
										onClick={this.handleSave}
									>
										Save
									</Button>
								) : (
									<Grid>
										<Button variant="outlined" onClick={this.handleEdit}>
											<EditIcon />
										</Button>
										<Button
											variant="outlined"
											color="error"
											onClick={this.handleDelete}
										>
											<DeleteIcon />
										</Button>
									</Grid>
								)}
							</Grid>
							<Grid></Grid>
						</Grid>
						<Grid item>
							{this.state.isVeg ? (
								<img height="45" src={veg} alt="veg"></img>
							) : (
								<img height="45" src={non_veg} alt="nonveg"></img>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

export default Menufooditem;
