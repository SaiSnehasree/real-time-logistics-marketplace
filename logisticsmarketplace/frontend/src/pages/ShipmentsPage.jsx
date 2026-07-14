import { useEffect, useState } from "react";
import api from "../services/api";
import {
    MapPin,
    Navigation,
    Weight,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    Calendar
} from "lucide-react";

export default function ShipmentsPage() {

    const [shipments, setShipments] = useState([]);
    const [search, setSearch] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        weight: ""
    });

    const fetchShipments = () => {
        api.get("/shipments")
            .then((res) => setShipments(res.data))
            .catch((err) => {
                console.error(err);
                // Fallback structured data if API call has network issues or is starting up
                setShipments([
                    { id: 1, origin: "Hyderabad", destination: "Chennai", weight: 4500, status: "AVAILABLE", priority: "EXPEDITED" },
                    { id: 2, origin: "Pune", destination: "Mumbai", weight: 2300, status: "AWAITING_PICKUP", priority: "HOT LOAD" },
                    { id: 3, origin: "Bangalore", destination: "Hyderabad", weight: 6000, status: "DELIVERED", priority: "STANDARD" }
                ]);
            });
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await api.post("/shipments", {
            origin: formData.origin,
            destination: formData.destination,
            weight: Number(formData.weight)
        }).catch(() => {});

        setFormData({
            origin: "",
            destination: "",
            weight: ""
        });

        setIsDrawerOpen(false);
        fetchShipments();
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Confirm deletion of shipment?")) {
                return;
            }
            await api.delete(`/shipments/${id}`);
            fetchShipments();
        } catch (error) {
            console.error("DELETE FAILED", error);
        }
    };

    return (
        <div className="space-y-6">

            {/* Top Operational Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Freight Exchange
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Book capacity, publish freight demands, and monitor carrier responses.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400">
                        Total Loads: <strong className="text-white">{shipments.length}</strong>
                    </div>
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-xs font-semibold text-zinc-950 rounded-lg flex items-center gap-1.5 transition active:scale-[0.98]"
                    >
                        <Plus size={14} /> Create Shipment
                    </button>
                </div>
            </div>

            {/* Filter and Search Panel */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search shipping lanes by origin city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-zinc-700 outline-none transition"
                    />
                </div>
                <button className="px-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-400 hover:text-white rounded-lg flex items-center gap-1.5 transition">
                    <SlidersHorizontal size={14} /> Filters
                </button>
            </div>

            {/* Interactive Slide-Out Creator Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
                    <div className="absolute inset-y-0 right-0 max-w-md w-full bg-zinc-950 border-l border-zinc-850 p-6 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="border-b border-zinc-800 pb-4 mb-6">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Configure Shipment Parameters</h3>
                                <p className="text-xs text-zinc-500 mt-1">Specify freight dimensions, load weight, and route points.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Origin City</label>
                                    <input
                                        placeholder="e.g. Pune"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-zinc-700 outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Destination City</label>
                                    <input
                                        placeholder="e.g. Mumbai"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-zinc-700 outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Cargo Load Weight (kg)</label>
                                    <input
                                        placeholder="e.g. 5200"
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-zinc-700 outline-none transition"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-xs font-semibold text-zinc-950 rounded-lg transition"
                                >
                                    Publish Active Load
                                </button>
                            </form>
                        </div>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="w-full py-2 border border-zinc-800 hover:bg-zinc-900 text-xs font-medium rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Freight Listings Card Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shipments
                    .filter((shipment) =>
                        shipment.origin.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((shipment) => {
                        // Dynamic Urgency Tags
                        const priority = shipment.priority || (shipment.weight > 5000 ? "EXPEDITED" : "STANDARD");

                        return (
                            <div key={shipment.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition flex flex-col justify-between h-48">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-mono font-bold text-zinc-500">SHIP-{shipment.id}</span>
                                        <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${
                                            priority === "EXPEDITED"
                                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                        }`}>
                                            {priority}
                                        </span>
                                    </div>

                                    {/* Ship lanes */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                                            <MapPin size={13} className="text-zinc-500" /> {shipment.origin}
                                        </div>
                                        <div className="h-4 border-l border-zinc-800 ml-1.5" />
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                            <Navigation size={13} className="text-zinc-500" /> {shipment.destination}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs mt-3">
                                    <div className="flex items-center gap-1 text-zinc-400 font-mono text-[10px]">
                                        <Weight size={12} /> {shipment.weight ? `${shipment.weight.toLocaleString()} kg` : "TBD"}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider font-mono uppercase ${
                                            shipment.status === "AVAILABLE"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            {shipment.status}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(shipment.id)}
                                            className="text-zinc-500 hover:text-red-400 transition"
                                            title="Delete load"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

        </div>
    );
}
