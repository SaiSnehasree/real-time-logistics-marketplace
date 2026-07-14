import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function AnalyticsChart({ analytics }) {

    const data = [
        {
            name: "Available",
            loads: analytics.available,
            revenue: analytics.available * 1250,
        },
        {
            name: "Awaiting Pickup",
            loads: analytics.awaitingPickup,
            revenue: analytics.awaitingPickup * 1400,
        },
        {
            name: "In Transit",
            loads: analytics.inTransit || 2,
            revenue: (analytics.inTransit || 2) * 1800,
        },
        {
            name: "Delivered",
            loads: analytics.delivered,
            revenue: analytics.delivered * 1500,
        }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
                    <p className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</p>
                    <div className="space-y-1 font-mono text-xs">
                        <div className="flex justify-between gap-4">
                            <span className="text-zinc-500">Active Loads:</span>
                            <span className="text-white font-bold">{payload[0].value}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-zinc-500">Est. Revenue:</span>
                            <span className="text-cyan-400 font-bold">₹{payload[0].payload.revenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Lane Volume & Capacity Feed
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Live updates showing dispatch loads against revenue margins</p>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorLoads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="loads"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorLoads)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}