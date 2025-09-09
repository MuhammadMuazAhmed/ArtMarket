import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/register";
import LoginPage from "./pages/login";
import Create from "./pages/create";
import Profile from "./pages/profile";
import { UserProvider } from "./Context/usercontext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Register />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
