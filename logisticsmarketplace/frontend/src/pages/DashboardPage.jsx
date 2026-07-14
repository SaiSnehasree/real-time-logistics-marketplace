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
    AlertTriangle,
    ShieldAlert,
    TrendingUp,
    ArrowRight
} from "lucide-react";

export default function DashboardPage() {
    const [analytics, setAnalytics] = useState(null);
    const [shipments, setShipments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/shipments/analytics")
            .then((res) => setAnalytics(res.data))
            .catch(() => {
                // Fallback structured data if API call has network issues or is starting up
                setAnalytics({
                    totalShipments: 12,
                    available: 4,
                    awaitingPickup: 5,
                    delivered: 3,
                    inTransit: 2
                });
            });

        api.get("/shipments")
            .then((res) => setShipments(res.data))
            .catch(() => {});
    }, []);

    if (!analytics) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-zinc-800 rounded w-1/3"></div>
                <div className="grid grid-cols-4 gap-6">
                    <div className="h-32 bg-zinc-900 rounded-xl"></div>
                    <div className="h-32 bg-zinc-900 rounded-xl"></div>
                    <div className="h-32 bg-zinc-900 rounded-xl"></div>
                    <div className="h-32 bg-zinc-900 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Header Block & Critical System Alerts */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Operations Dashboard
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Dispatcher dashboard for fleet scheduling, route deviations, and real-time bids.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-500">Live feed:</span>
                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {shipments.length} Active Postings
                    </span>
                </div>
            </div>

            {/* Critical Alert Warning Panel */}
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg text-red-400">
                <ShieldAlert size={18} className="shrink-0" />
                <div className="text-xs">
                    <strong>Critical Dispatch Warning:</strong> Shipment <strong>SHIP-2</strong> has experienced a geo-fence route deviation near Pune. ETA confidence dropped to 42%.
                </div>
            </div>

            {/* Logistics operational KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Shipments"
                    value={analytics.totalShipments - analytics.delivered}
                    icon={<Package className="text-cyan-400" size={16} />}
                    color="bg-cyan-500/10"
                    trend="+14% vs avg"
                    trendType="up"
                />

                <StatCard
                    title="Delayed Loads"
                    value="1"
                    icon={<AlertTriangle className="text-amber-400" size={16} />}
                    color="bg-amber-500/10"
                    trend="-23% improvement"
                    trendType="up"
                />

                <StatCard
                    title="On-Time Delivery (OTD)"
                    value="98.4%"
                    icon={<CheckCircle className="text-emerald-400" size={16} />}
                    color="bg-emerald-500/10"
                    trend="+1.2% SLA gain"
                    trendType="up"
                />

                <StatCard
                    title="Carrier Utilization"
                    value="84.2%"
                    icon={<Truck className="text-blue-400" size={16} />}
                    color="bg-blue-500/10"
                    trend="+5.4% efficiency"
                    trendType="up"
                />
            </div>

            {/* Main Interactive Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Visual Lane Capacity and Revenue Charts */}
                <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
                    <AnalyticsChart analytics={analytics} />
                </div>

                {/* Operations Checklist / Watchlist */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-800">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                Route Control Checklist
                            </h3>
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">DISPATCH QUEUE</span>
                        </div>
                        <ul className="space-y-3 text-xs">
                            <li className="flex justify-between items-start gap-2 bg-zinc-950/40 p-2.5 rounded border border-zinc-800/40">
                                <div>
                                    <p className="font-semibold text-zinc-200">Carrier Verification</p>
                                    <p className="text-[10px] text-zinc-500">Validate compliance license for Bangalore-Mumbai lanes</p>
                                </div>
                                <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase font-mono">Pending</span>
                            </li>
                            <li className="flex justify-between items-start gap-2 bg-zinc-950/40 p-2.5 rounded border border-zinc-800/40">
                                <div>
                                    <p className="font-semibold text-zinc-200">Fuel Surcharge Calibration</p>
                                    <p className="text-[10px] text-zinc-500">Recalculate index rate based on national updates</p>
                                </div>
                                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-mono">Optimal</span>
                            </li>
                        </ul>
                    </div>
                    <button onClick={() => navigate("/tracking")} className="w-full mt-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 text-zinc-300 hover:text-white transition">
                        Manage Live Telemetry <ArrowRight size={13} />
                    </button>
                </div>
            </div>

            {/* High Priority Dispatch Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Active Shipment Control Center
                        </h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">High-priority dispatch overview tracking transport lane statuses.</p>
                    </div>
                    <button
                        onClick={() => navigate("/shipments")}
                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                        Access Exchange <ArrowRight size={13} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-800">
                            <tr>
                                <th className="p-4 font-semibold">Load ID</th>
                                <th className="p-4 font-semibold">Route Path</th>
                                <th className="p-4 font-semibold">Weight</th>
                                <th className="p-4 font-semibold">Schedule Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {shipments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-zinc-500 font-mono">
                                        No active loads located. Setup new shipments on the Freight Exchange.
                                    </td>
                                </tr>
                            ) : (
                                shipments.slice().reverse().slice(0, 5).map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="p-4 font-mono font-bold text-zinc-300">
                                            SHIP-{shipment.id}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-white">{shipment.origin}</span>
                                            <span className="text-zinc-500 mx-2 font-mono">→</span>
                                            <span className="text-zinc-300">{shipment.destination}</span>
                                        </td>
                                        <td className="p-4 font-mono text-zinc-400">
                                            {shipment.weight ? `${shipment.weight} kg` : "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                                    shipment.status === "AVAILABLE"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : shipment.status === "AWAITING_PICKUP"
                                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            : shipment.status === "DELIVERED"
                                                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                                }`}
                                            >
                                                {shipment.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => navigate("/tracking")}
                                                className="px-2.5 py-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-[10px] font-semibold text-zinc-300 hover:text-white rounded transition"
                                            >
                                                Track Live
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}



