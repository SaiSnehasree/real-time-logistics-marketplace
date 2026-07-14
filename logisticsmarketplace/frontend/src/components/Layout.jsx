import {
    LayoutDashboard,
    Package,
    Gavel,
    MapPinned,
    Bell,
    LogOut,
    Activity,
    AlertTriangle,
    ShieldAlert
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

export default function Layout() {

    const navigate = useNavigate();

    const links = [
        { name: "Operations", path: "/", icon: LayoutDashboard },
        { name: "Freight Exchange", path: "/shipments", icon: Package },
        { name: "Bidding Feed", path: "/bids", icon: Gavel },
        { name: "Control Tower", path: "/tracking", icon: MapPinned }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased">

            {/* Floating Top Control Tower Navigation */}
            <header className="sticky top-0 z-50 px-4 py-3 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* Logo & Operational Status */}
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                LOGIFLOW <span className="text-[10px] uppercase font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">Control Tower</span>
                            </h1>
                        </div>

                        {/* Top Telemetry Header Summary */}
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-zinc-500 border-l border-zinc-800 pl-6">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Fleet Status: Optimal</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Activity size={12} className="text-cyan-400" />
                                <span className="text-zinc-300">OTD: <strong className="text-white">98.4%</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <AlertTriangle size={12} className="text-amber-400" />
                                <span className="text-zinc-300">Pending Bids: <strong className="text-white">5</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Primary Links */}
                    <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/60">
                        {links.map((link) => {
                            const Icon = link.icon;

                            return (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path === "/"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                                            isActive
                                                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/50"
                                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                                        }`
                                    }
                                >
                                    <Icon size={14} />
                                    <span>{link.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Notification, Profile, & Logout */}
                    <div className="flex items-center gap-3">

                        <button className="relative w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center transition">
                            <Bell size={15} className="text-zinc-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                        </button>

                        <div className="hidden sm:flex items-center gap-2.5 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                AD
                            </div>
                            <div className="leading-none">
                                <p className="text-xs font-medium text-zinc-200">
                                    Admin Dispatch
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition"
                        >
                            <LogOut size={13} />
                            Logout
                        </button>

                    </div>

                </div>
            </header>

            {/* Mobile Navigation bar */}
            <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex justify-around">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === "/"}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-lg ${
                                    isActive
                                        ? "text-cyan-400 bg-zinc-800/40"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`
                            }
                        >
                            <Icon size={16} />
                            <span>{link.name}</span>
                        </NavLink>
                    );
                })}
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
            </main>

        </div>
    );
}