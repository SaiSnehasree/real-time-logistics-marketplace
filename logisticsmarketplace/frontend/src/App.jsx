import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import BidsPage from "./pages/BidsPage";

export default function App() {

  return (
      <BrowserRouter>

        <Routes>

          <Route
              path="/"
              element={<DashboardPage />}
          />
            <Route
                path="/shipments"
                element={<ShipmentsPage />}
            />
            <Route
                path="/bids"
                element={<BidsPage />}
            />

        </Routes>



      </BrowserRouter>
  );
}