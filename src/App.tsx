import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import Missions from "./pages/Missions";
import NotFoundPage from "./pages/404";
import Game from "./pages/Game";
import Tutorial from "./pages/Tutorial";
import Admin from "./pages/Admin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Users from "./components/Admin/Users";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/missions" element={<Missions />} />
        <Route path="/game" element={<Game />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
