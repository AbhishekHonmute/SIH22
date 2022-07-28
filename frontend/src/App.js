import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Venue from "./pages/Venue";
import CanteenRegister from "./pages/CanteenRegister";
import CanteenLogin from "./pages/CanteenLogin";
import CanteenDashboard from "./pages/CanteenDashboard";
import MenuAppBar from "./components/MenuAppBar";
import Fooditem from "./pages/Fooditem";
import Order from "./pages/Order";

function App() {
  return (
    <BrowserRouter>
      <MenuAppBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add_venue" element={<Venue />} />
        <Route path="/update_venue/:venue_id" element={<Venue isUpdate={true}/>} />
        <Route path="/add_fooditem" element={<Fooditem />} />
        <Route path="/update_fooditem" element={<Fooditem update={true}/>} />
        <Route path="/canteen/:canteen_id" element={<CanteenDashboard />} />
        <Route path="/register_canteen" element={<CanteenRegister />} />
        <Route path="/login_canteen" element={<CanteenLogin />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
