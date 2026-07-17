import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import BidsPage from "./pages/BidsPage";
import TrackingPage from "./pages/TrackingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage.jsx";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationsPage from "./pages/NotificationsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/shipments" element={<ShipmentsPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/bids" element={<BidsPage />} />
                    <Route path="/tracking" element={<TrackingPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;