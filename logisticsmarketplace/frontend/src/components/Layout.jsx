import {
    LayoutDashboard,
    Package,
    Gavel,
    MapPinned,
    Bell,
    LogOut
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

export default function Layout() {

    const navigate = useNavigate();

    const links = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Shipments", path: "/shipments", icon: Package },
        { name: "Bids", path: "/bids", icon: Gavel },
        { name: "Tracking", path: "/tracking", icon: MapPinned }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-black text-white">

            <header className="sticky top-0 z-50 p-5">
                <div className="max-w-7xl mx-auto">

                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl px-8 py-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <h1 className="text-2xl font-bold">
                                    LogiFlow
                                </h1>
                                <p className="text-xs text-slate-400">
                                    Logistics Marketplace
                                </p>
                            </div>

                            <nav className="flex items-center gap-3">

                                {links.map((link) => {
                                    const Icon = link.icon;

                                    return (
                                        <NavLink
                                            key={link.name}
                                            to={link.path}
                                            end={link.path === "/"}
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                }`
                                            }
                                        >
                                            <Icon size={18} />
                                            <span>{link.name}</span>
                                        </NavLink>
                                    );
                                })}

                            </nav>

                            <div className="flex items-center gap-3">

                                <button className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center">
                                    <Bell size={18} />
                                </button>

                                <div className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-2xl">

                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600" />

                                    <div>
                                        <p className="text-sm font-medium">
                                            Admin
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Logistics Manager
                                        </p>
                                    </div>

                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-5 pb-10">
                <Outlet />
            </main>

        </div>
    );
}