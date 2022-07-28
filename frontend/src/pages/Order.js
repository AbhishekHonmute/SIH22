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
import {
	Input,
	MenuItem,
	Select,
	Slider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";

const backendURLOrder = "http://localhost:5000/api/order";
const backendURLCanteen = "http://localhost:5000/api/canteen";

const theme = createTheme();

class Order extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order_id:"",
			canteens: [],
			canteenOrder: "",
			canteen_id: "",
			event_id: "",
			venue_id: "",
			amount: 0,
			status: "",
			items: [],
			maxQuantity: 80,
			quantity: 0,
			menu: [],
			menuOrder: "",
			iserror: false,
		};
	}
	componentDidMount = () => {
		const isUpdate = this.props.isUpdate;
		if (isUpdate) {
			const order_id = window.location.pathname.split("/")[2];
			try {
				axios
					.get(`${backendURLOrder}/get_order/${order_id}`)
					.then((res) => {
						if (res.status === 200) {
							const data = res.data.result;
							this.setState({
								order_id : data.order_id,
								canteen_id : data.canteen_id,
								event_id : data.event_id,
								venue_id : data.venue_id,
								amount : data.amount,
								status : data.status,
								items : data.items,
							});
						} else {
							this.setState({ iserror: true });
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.log("COMPONENT UPDATE ERROR" + error);
				this.setState({ iserror: true });
			}
		}
		axios.get(`${backendURLCanteen}/get_canteens`)
		.then((res) => {
			this.setState({canteens: res.data.result});
			this.setState({canteenOrder: res.data.result[0].id})
			axios.get(`${backendURLCanteen}/get_menu/${this.state.canteenOrder}`)
			.then((res) => {
				this.setState({menu: res.data.result});
				this.setState({menuOrder: res.data.result[0][0]});
				console.log(res.data.result);
			})
			.catch((error) => {
				console.log("ERROR FETCHING MENU : " + error);
			})
		})
		.catch((error) => {
			console.log("ERROR FETCHING CANTEENS : " + error);
		})
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		const isUpdate = this.props.isUpdate;
		const data = {
			order_id : this.state.order_id,
			canteen_id : this.state.canteen_id,
			event_id : this.state.event_id,
			venue_id : this.state.venue_id,
			amount : this.state.amount,
			status : this.state.status,
			items : this.state.items,
		};
		// console.log({
			// order_id +
			// canteen_id +
			// event_id +
			// venue_id +
			// amount +
			// status +
			// items +
		// });
		if (isUpdate && this.state.iserror === false) {
			try {
				await axios
					.post(`${backendURLOrder}/update_order`, data)
					.then((res) => {
						console.log(res.data);
						const token = res.token;
						console.log(token);
						localStorage.setItem("updateOrderToken", token);
						// SOMETHING WRONG HERE
						// this.props.history.push("./");
					})
					.catch((error) => {
						if (error.response.status === 401) {
							this.setState({
								iserror: true,
								errormessage: "Unable to update Order",
							});
						}
						console.log(error.response.data);
					});
			} catch (error) {
				console.log("UPDATE order ERROR " + error);
				this.setState({ iserror: true });
			}
		} else {
			if (this.state.iserror === false) {
				try {
					await axios
						.post(`${backendURLOrder}/add_order`, data)
						.then((res) => {
							if (res.status === 200) {
								console.log(res);
								this.props.history.push("/order");
							}
							// What is this token?
							const token = res.token;
							console.log(token);
							localStorage.setItem("addorderToken", token);
							// SOMETHING WRONG HERE
							// this.props.history.push("./");
						})
						.catch((error) => {
							console.log(error);
						});
				} catch (error) {
					console.log("ADD order ERROR" + error);
					this.setState({ iserror: true });
				}
			}
		}
	};

	handleChange = (event) => {
		if (event.target.name === "amount") {
			this.setState({
				[event.target.name]: event.target.value.replace(/\D/, ""),
			});
		} else {
			this.setState({
				[event.target.name]: event.target.value,
			});
		}
	};
	handleSliderChange = (event) => {
		this.setState({quantity: event.target.value});
	  };
	
	handleQuantityChange = (event) => {
		this.setState({quantity: Number(event.target.value)});
	  };
	loadCanteen = (event) => {
		this.setState({canteenOrder: event.target.value});
		axios.get(`${backendURLCanteen}/get_menu/${event.target.value}`)
		.then((res) => {
			this.setState({menu: res.data.result});
			this.setState({menuOrder: res.data.result[0][0]});
			console.log(res.data.result);
		})
		.catch((error) => {
			console.log("ERROR FETCHING MENU : " + error);
		})
	};

	handleChangeItem = (event) => {
		this.setState({menuOrder: event.target.value});	
	}
	addItem = () => {
		let newItems = this.state.items;
		let foundItem = false;
		for(let i = 0; i < newItems.length; i++) {
			if(this.state.menuOrder === newItems[i].id) {
				if(newItems[i].quantity + this.state.quantity > this.state.maxQuantity) {
					newItems[i].quantity = this.state.maxQuantity;
				}
				else {
					newItems[i].quantity += this.state.quantity;
				}
				foundItem = true;
			}
		}
		if(!foundItem) {
			let order = {id: "", quantity: 0}
			order.id = this.state.menuOrder;
			order.quantity = this.state.quantity;
			newItems.push(order);
		}
		this.setState({items: newItems});

	};

	deleteItem = (event) => {
		console.log(event.target.id);
		var arr = this.state.items;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]["id"] === event.target.id) {
				arr.splice(i, 1);
				break;
			}
		}
		this.setState({ items: arr });
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
								id="order_id"
								label="order ID"
								name="order_id"
								autoComplete="order_id"
								autoFocus
								value={this.state.order_id}
								onChange={this.handleChange}
							/>
							<Select
								labelId="Select Canteen"
								id="canteenSelector"
								value={this.state.canteenOrder}
								label="Canteen"
								onChange={this.loadCanteen}
								>
								{this.state.canteens &&
									this.state.canteens.map((canteen) => (
									<MenuItem value={ canteen.id } key={canteen.id}>{canteen.name}</MenuItem>
								))
								}
							</Select>
							<Select
								labelId="Select Menu Item"
								id="menuSelector"
								name="menuSelector"
								value={this.state.menuOrder}
								label="Menu"
								onChange={this.handleChangeItem}
								>
								{this.state.menu &&
									this.state.menu.map((item) => (
									<MenuItem value={ item[0] } key={item[0]}>{item[1]	}</MenuItem>
								))
								}
							</Select>
							<Slider
								value={this.state.quantity}
								max={this.state.maxQuantity}
								onChange={this.handleSliderChange}
								aria-labelledby="input-slider"
							/>
							<Input
								value={this.state.quantity}
								size="small"
								onChange={this.handleQuantityChange}
								inputProps={{
								step: 10,
								min: 0,
								max: this.state.maxQuantity,
								type: 'number',
								'aria-labelledby': 'input-slider',
								}}
							/>
							<Button
								type="button"
								fullWidth
								variant="outlined"
								onClick={this.addItem}
								sx={{ mt: 3, mb: 2 }}
							>
								Add Item
							</Button>
							<TableContainer component={Paper} sx={{ marginBottom: 8 }}>
								<Table sx={{ minWidth: 700 }} aria-label="customized table">
									<TableHead>
										<TableRow>
											<TableCell>ITEM ID</TableCell>
											<TableCell align="right">NAME</TableCell>
											<TableCell align="right">QUANTITY</TableCell>
											<TableCell align="right">DELETE</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.items &&
											this.state.items.map((item) => (
												<TableRow key={item["id"]}>
													<TableCell component="th" scope="item">
														{item["id"]}
													</TableCell>
													<TableCell align="right">
														{item["quantity"]}
													</TableCell>
													<TableCell align="right">
														<Button
															type="button"
															variant="contained"
															color="error"
															id={item["id"]}
															endIcon={<DeleteIcon />}
															onClick={this.deleteItem}
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
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Register order
							</Button>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		);
	}
}

export default Order;
