import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Venue from "./pages/Venue";
import Event from "./pages/Event";
import SocialMedia from "./pages/SocialMedia";
import MenuAppBar from "./components/MenuAppBar";

function App() {
  return (
    <BrowserRouter>
      <MenuAppBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add_venue" element={<Venue />} />
        <Route
          path="/update_venue/:venue_id"
          element={<Venue isUpdate={true} />}
        />
        <Route path="/add_event" element={<Event />} />
        <Route
          path="/update_event/:event_id"
          element={<Event isUpdate={true} />}
        />
        <Route path="share" element={<SocialMedia />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
