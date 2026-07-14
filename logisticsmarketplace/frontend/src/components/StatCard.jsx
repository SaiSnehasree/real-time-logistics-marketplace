export default function StatCard({ title, value, icon, color, trend, trendType = "up" }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                        {title}
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-white font-mono">
                        {value}
                    </h2>
                    {trend && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded ${
                                trendType === "up" 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                                {trend}
                            </span>
                            <span className="text-[10px] text-zinc-500">vs last week</span>
                        </div>
                    )}
                </div>

                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-800 ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}