import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function AnalyticsChart({ analytics }) {

    const data = [
        {
            name: "Available",
            value: analytics.available
        },
        {
            name: "Awaiting",
            value: analytics.awaitingPickup
        },
        {
            name: "Transit",
            value: analytics.inTransit
        },
        {
            name: "Delivered",
            value: analytics.delivered
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow">

            <h2 className="text-xl font-semibold mb-4">
                Shipment Analytics
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}