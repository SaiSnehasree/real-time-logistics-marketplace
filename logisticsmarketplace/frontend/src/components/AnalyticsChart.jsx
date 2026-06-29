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
            value: analytics.inTransit || 0
        },
        {
            name: "Delivered",
            value: analytics.delivered
        }
    ];

    return (
        <div>

            <h2 className="text-2xl font-bold text-white mb-6">
                Shipment Analytics
            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >
                <BarChart data={data}>

                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        tick={{ fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #1e293b",
                            borderRadius: "12px",
                            color: "#fff"
                        }}
                    />

                    <Bar
                        dataKey="value"
                        fill="#06b6d4"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}