import { useEffect, useState } from "react";
import api from "../services/api";
import {
    MapPin,
    Navigation,
    Weight,
    Gavel,
    Search,
    SlidersHorizontal,
    Box,
    Loader2,
    AlertCircle,
    RefreshCw
} from "lucide-react";

export default function MarketplacePage() {
    const [shipments, setShipments] = useState([]);
    const [search, setSearch] = useState("");
    const [bidAmounts, setBidAmounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState({});
    const [bidSuccess, setBidSuccess] = useState({});

    const fetchMarketplace = () => {
        setLoading(true);
        setError(null);
        api.get("/shipments/marketplace")
            .then((res) => setShipments(res.data.data || []))
            .catch((err) => {
                console.error(err);
                setError("Failed to load available loads. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const handleBid = async (shipmentId) => {
        const amount = bidAmounts[shipmentId];
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }

        setSubmitting(prev => ({ ...prev, [shipmentId]: true }));
        try {
            await api.post("/bids", {
                shipmentId,
                amount: Number(amount)
            });
            setBidSuccess(prev => ({ ...prev, [shipmentId]: true }));
            setBidAmounts(prev => ({ ...prev, [shipmentId]: "" }));
            // Reset success indicator after 3s
            setTimeout(() => setBidSuccess(prev => ({ ...prev, [shipmentId]: false })), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to place bid.");
        } finally {
            setSubmitting(prev => ({ ...prev, [shipmentId]: false }));
        }
    };

    const filtered = shipments.filter((s) =>
        s.origin?.toLowerCase().includes(search.toLowerCase()) ||
        s.destination?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Box className="text-cyan-500" /> Freight Marketplace
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Find available loads and place competitive bids to secure freight contracts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400">
                        Available Loads: <strong className="text-white">{shipments.length}</strong>
                    </div>
                    <button
                        onClick={fetchMarketplace}
                        className="p-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-lg transition"
                        title="Refresh"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Filter and Search Panel */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search loads by origin or destination..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-zinc-700 outline-none transition"
                    />
                </div>
                <button className="px-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-400 hover:text-white rounded-lg flex items-center gap-1.5 transition">
                    <SlidersHorizontal size={14} /> Filters
                </button>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-44 bg-zinc-900/60 border border-zinc-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-4 rounded-lg text-red-400">
                    <AlertCircle size={18} className="shrink-0" />
                    <div className="flex-1 text-xs">{error}</div>
                    <button onClick={fetchMarketplace} className="text-xs underline">Retry</button>
                </div>
            )}

            {/* Load Grid */}
            {!loading && !error && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((shipment) => {
                        const placed = bidSuccess[shipment.id];
                        return (
                            <div key={shipment.id} className={`bg-zinc-900/60 border rounded-xl p-5 hover:border-zinc-700/80 transition flex flex-col justify-between ${placed ? 'border-emerald-500/40' : 'border-zinc-800/80'}`}>
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-mono font-bold text-zinc-500">SHIP-{shipment.id}</span>
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                                            {shipment.status}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                                            <MapPin size={13} className="text-zinc-500" /> {shipment.origin}
                                        </div>
                                        <div className="h-4 border-l border-zinc-800 ml-1.5" />
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                            <Navigation size={13} className="text-zinc-500" /> {shipment.destination}
                                        </div>
                                    </div>

                                    {shipment.description && (
                                        <p className="text-[10px] text-zinc-600 mt-2 line-clamp-2">{shipment.description}</p>
                                    )}
                                </div>

                                <div className="border-t border-zinc-800/80 pt-3 mt-4">
                                    <div className="flex items-center gap-1 text-zinc-400 font-mono text-[10px] mb-3">
                                        <Weight size={12} /> {shipment.weight ? `${Number(shipment.weight).toLocaleString()} kg` : "TBD"}
                                    </div>
                                    {placed ? (
                                        <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs font-semibold text-center flex items-center justify-center gap-1">
                                            ✓ Bid Placed!
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Amount (₹)"
                                                value={bidAmounts[shipment.id] || ""}
                                                onChange={(e) => setBidAmounts(prev => ({ ...prev, [shipment.id]: e.target.value }))}
                                                className="flex-1 bg-zinc-950 border border-zinc-700 text-xs px-2 py-1.5 rounded outline-none focus:border-cyan-500 text-white"
                                                min={1}
                                            />
                                            <button
                                                onClick={() => handleBid(shipment.id)}
                                                disabled={submitting[shipment.id]}
                                                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-zinc-950 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition"
                                            >
                                                {submitting[shipment.id]
                                                    ? <Loader2 size={12} className="animate-spin" />
                                                    : <Gavel size={12} />
                                                }
                                                Bid
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                            <Box className="mx-auto text-zinc-700 mb-3" size={28} />
                            <p className="text-sm font-semibold">No loads available</p>
                            <p className="text-xs text-zinc-700 mt-1">
                                {search ? "No loads match your search." : "No loads on the marketplace right now."}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
