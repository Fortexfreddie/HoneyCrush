import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import Missions from "./pages/Missions";
import NotFoundPage from "./pages/404";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/missions" element={<Missions />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
