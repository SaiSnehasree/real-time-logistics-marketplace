import {
    LayoutDashboard,
    Package,
    Gavel,
    MapPinned,
    Bell,
    LogOut,
    Activity,
    AlertTriangle,
    Box
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";
import api from "../services/api";

export default function Layout() {

    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (user.id) {
            api.get("/notifications/unread-count")
               .then(res => setUnreadCount(res.data.data))
               .catch(console.error);
        }
    }, [user.id]);

    let links = [];
    if (user.role === 'SHIPPER') {
        links = [
            { name: "Dashboard", path: "/", icon: LayoutDashboard },
            { name: "My Shipments", path: "/shipments", icon: Package },
            { name: "Bidding Feed", path: "/bids", icon: Gavel },
            { name: "Control Tower", path: "/tracking", icon: MapPinned }
        ];
    } else if (user.role === 'CARRIER') {
        links = [
            { name: "Dashboard", path: "/", icon: LayoutDashboard },
            { name: "Marketplace", path: "/marketplace", icon: Box },
            { name: "My Bids", path: "/bids", icon: Gavel },
            { name: "Active Runs", path: "/tracking", icon: MapPinned }
        ];
    } else {
        links = [
            { name: "Operations", path: "/", icon: LayoutDashboard }
        ];
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
                                <span>Network: Optimal</span>
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

                        <button onClick={() => navigate("/notifications")} className="relative w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center transition cursor-pointer">
                            <Bell size={15} className="text-zinc-400" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center text-white border-2 border-[#09090b]">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <div className="hidden sm:flex items-center gap-2.5 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {user.name ? user.name.substring(0,2).toUpperCase() : 'U'}
                            </div>
                            <div className="leading-none">
                                <p className="text-xs font-medium text-zinc-200">
                                    {user.name || "User"}
                                </p>
                                <p className="text-[9px] text-zinc-500 font-mono tracking-wider mt-0.5">
                                    {user.role || "ROLE"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        >
                            <LogOut size={13} />
                            <span className="hidden sm:inline">Logout</span>
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