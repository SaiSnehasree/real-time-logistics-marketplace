import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";

import {
    Package,
    Truck,
    Clock3,
    CheckCircle,

} from "lucide-react";

export default function DashboardPage() {

    const [analytics, setAnalytics] = useState(null);
    const [shipments, setShipments] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {

        api.get("/shipments/analytics")
            .then((res) => setAnalytics(res.data));

        api.get("/shipments")
            .then((res) => setShipments(res.data));

    }, []);

    if (!analytics) {
        return (

                <h1 className="text-white">
                    Loading...
                </h1>

        );
    }

    return (


            <div className="space-y-8">


                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-5xl font-bold text-white">
                            Welcome Back 👋
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Track shipments, manage bids, and monitor logistics activity.
                        </p>

                        <div className="flex gap-6 mt-4 text-sm text-slate-400">
                            <span>{shipments.length} Active Shipments</span>
                            <span>{analytics.available} Available</span>
                            <span>{analytics.awaitingPickup} Awaiting Pickup</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">




                    </div>

                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <StatCard
                        title="Total Shipments"
                        value={analytics.totalShipments}
                        icon={<Package className="text-blue-400" />}
                        color="bg-blue-500/10"
                    />

                    <StatCard
                        title="Available"
                        value={analytics.available}
                        icon={<Truck className="text-green-400" />}
                        color="bg-green-500/10"
                    />

                    <StatCard
                        title="Awaiting Pickup"
                        value={analytics.awaitingPickup}
                        icon={<Clock3 className="text-amber-400" />}
                        color="bg-amber-500/10"
                    />

                    <StatCard
                        title="Delivered"
                        value={analytics.delivered}
                        icon={<CheckCircle className="text-purple-400" />}
                        color="bg-purple-500/10"
                    />

                </div>
                <div className="grid xl:grid-cols-2 gap-6">

                    <div
                        className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-3xl
                        p-6
                        "
                    >

                        <AnalyticsChart analytics={analytics} />
                    </div>

                    <div
                        className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-3xl
                        p-6
                        "
                    >

                        <div className="flex justify-between mb-6">

                            <h2 className="text-2xl font-bold">
                                Recent Shipments
                            </h2>

                            <button
                                onClick={() => navigate("/shipments")}
                                className="
    text-cyan-400
    hover:text-cyan-300
    "
                            >
                                View All →
                            </button>
                        </div>

                        <table className="w-full">

                            <thead>

                            <tr className="border-b border-slate-800">

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Origin
                                </th>

                                <th className="p-4 text-left">
                                    Destination
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            {shipments
                                .slice()
                                .reverse()
                                .slice(0, 5)
                                .map((shipment) => (

                                    <tr
                                        key={shipment.id}
                                        className="
                                        border-b
                                        border-slate-800
                                        "
                                    >

                                        <td className="p-4">
                                            {shipment.id}
                                        </td>

                                        <td className="p-4">
                                            {shipment.origin}
                                        </td>

                                        <td className="p-4">
                                            {shipment.destination}
                                        </td>

                                        <td className="p-4">
    <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
            shipment.status === "AVAILABLE"
                ? "bg-green-500/20 text-green-400"
                : shipment.status === "AWAITING_PICKUP"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : shipment.status === "DELIVERED"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-slate-700 text-white"
        }`}
    >
        {shipment.status}
    </span>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


    );
}
