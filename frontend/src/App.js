import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Venue from "./pages/Venue";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
