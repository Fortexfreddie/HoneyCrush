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
import Settings from "./components/Admin/Settings";
import Maintenance from "./pages/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import Rewards from "./components/Admin/Rewards";
import CreateMissions from "./components/Admin/Missions";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/missions" element={<Missions />} />
        <Route path="/game" element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        } />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/rewards" element={<Rewards />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/missions" element={<CreateMissions />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
