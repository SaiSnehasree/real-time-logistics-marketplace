import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import Layout from "../components/Layout.jsx";
import AnalyticsChart from "../components/AnalyticsChart";

export default function DashboardPage() {

    const [analytics, setAnalytics] = useState(null);
    const [shipments, setShipments] = useState([]);
    useEffect(() => {

        api.get("/shipments/analytics")
            .then(res => setAnalytics(res.data));

        api.get("/shipments")
            .then(res => setShipments(res.data));

    }, []);
    if (!analytics) return <h1>Loading...</h1>;

    return (
        <Layout>
        <div className="min-h-screen bg-slate-100 p-8">

            <h1 className="text-4xl font-bold mb-8">
                Logistics Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                <StatCard
                    title="Total Shipments"
                    value={analytics.totalShipments}
                />

                <StatCard
                    title="Available"
                    value={analytics.available}
                />

                <StatCard
                    title="Awaiting Pickup"
                    value={analytics.awaitingPickup}
                />

                <StatCard
                    title="In Transit"
                    value={analytics.inTransit}
                />

                <StatCard
                    title="Delivered"
                    value={analytics.delivered}
                />
                <div className="mt-8">
                    <AnalyticsChart analytics={analytics} />
                </div>
                <div className="mt-8 bg-white rounded-2xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Recent Shipments
                    </h2>

                    <table className="w-full">

                        <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Origin</th>
                            <th className="p-3 text-left">Destination</th>
                            <th className="p-3 text-left">Status</th>
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
                                    className="border-b"
                                >
                                    <td className="p-3">
                                        {shipment.id}
                                    </td>

                                    <td className="p-3">
                                        {shipment.origin}
                                    </td>

                                    <td className="p-3">
                                        {shipment.destination}
                                    </td>

                                    <td className="p-3">
                                        {shipment.status}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
   </Layout>
    );
}