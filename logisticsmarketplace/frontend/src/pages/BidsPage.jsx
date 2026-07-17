import { useEffect, useState } from "react";
import api from "../services/api";
import { Gavel, Star, ShieldCheck, TrendingDown, Check, X, Loader2, RefreshCw, AlertCircle } from "lucide-react";

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = type === "success"
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-red-500/10 border-red-500/30 text-red-400";

    return (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-medium shadow-xl ${colors}`}>
            {type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
            {message}
        </div>
    );
}

export default function BidsPage() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [toast, setToast] = useState(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const fetchBids = () => {
        setLoading(true);
        const endpoint = user.role === "CARRIER" ? "/bids/my" : "/bids";
        api.get(endpoint)
            .then((res) => {
                const data = res.data.data || [];
                if (user.role === "SHIPPER") {
                    // For shippers: show bids on their own shipments
                    setBids(data.filter(bid => bid.shipment?.shipper?.id === user.id));
                } else {
                    setBids(data);
                }
            })
            .catch((err) => {
                console.error(err);
                setBids([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccept = async (id) => {
        if (!window.confirm("Accept this bid? All other bids for this shipment will be rejected.")) return;
        setActionLoading(prev => ({ ...prev, [id]: "accept" }));
        try {
            await api.post(`/bids/${id}/accept`);
            showToast("Bid accepted successfully!", "success");
            fetchBids();
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to accept bid.", "error");
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject this bid?")) return;
        setActionLoading(prev => ({ ...prev, [id]: "reject" }));
        try {
            await api.post(`/bids/${id}/reject`);
            showToast("Bid rejected.", "success");
            fetchBids();
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to reject bid.", "error");
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: null }));
        }
    };

    const pendingBids   = bids.filter(b => b.status === "PENDING").length;
    const acceptedBids  = bids.filter(b => b.status === "ACCEPTED").length;
    const rejectedBids  = bids.filter(b => b.status === "REJECTED").length;

    return (
        <div className="space-y-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Gavel size={22} className="text-cyan-400" />
                        {user.role === "CARRIER" ? "My Bids" : "Carrier Bidding Feed"}
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        {user.role === "CARRIER"
                            ? "Track all bids you have submitted on available freight."
                            : "Review and confirm carrier bids submitted for your published shipping lanes."}
                    </p>
                </div>
                <button
                    onClick={fetchBids}
                    className="p-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-lg transition"
                    title="Refresh"
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Total</p>
                    <h3 className="text-2xl font-semibold text-white mt-1 font-mono">{bids.length}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Pending</p>
                    <h3 className="text-2xl font-semibold text-amber-400 mt-1 font-mono">{pendingBids}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Accepted</p>
                    <h3 className="text-2xl font-semibold text-emerald-400 mt-1 font-mono">{acceptedBids}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Rejected</p>
                    <h3 className="text-2xl font-semibold text-red-400 mt-1 font-mono">{rejectedBids}</h3>
                </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-zinc-900/60 border border-zinc-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* High Fidelity Bids List Layout */}
            {!loading && (
                <div className="space-y-4">
                    {bids.length === 0 ? (
                        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
                            <Gavel className="mx-auto text-zinc-600 mb-3" size={32} />
                            <p className="text-sm font-semibold">No bids yet</p>
                            <p className="text-xs text-zinc-600 mt-1">
                                {user.role === "CARRIER"
                                    ? "Go to the Marketplace to place bids on available loads."
                                    : "Carriers will submit offers when loads are published on the exchange."}
                            </p>
                        </div>
                    ) : (
                        bids.map((bid) => {
                            const isUnderMarket = bid.laneAvg ? bid.amount <= bid.laneAvg : false;
                            const isActing = actionLoading[bid.id];

                            return (
                                <div key={bid.id} className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/60 rounded-xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    {/* Carrier Profile info */}
                                    <div className="space-y-2 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold text-sm text-white">
                                                {bid.carrier?.name || "Independent Carrier"}
                                            </h4>
                                            <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                                <Star size={10} fill="currentColor" /> 4.8
                                            </span>
                                            <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                <ShieldCheck size={10} /> Active SLA
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 font-mono truncate">
                                            Lane: {bid.shipment?.origin || "Origin"} → {bid.shipment?.destination || "Destination"}
                                            {bid.shipment?.id && <span className="ml-1 text-zinc-600">(SHIP-{bid.shipment.id})</span>}
                                        </p>
                                    </div>

                                    {/* Bidding Telemetry & Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-4 md:gap-6 shrink-0">

                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Submitted Bid</p>
                                            <h4 className="text-lg font-bold text-white font-mono">
                                                ₹{Number(bid.amount).toLocaleString()}
                                            </h4>
                                        </div>

                                        {bid.laneAvg && (
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Market Avg</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-zinc-300 font-mono">₹{bid.laneAvg.toLocaleString()}</span>
                                                    <span className={`text-[10px] font-mono px-1 rounded flex items-center gap-0.5 ${
                                                        isUnderMarket
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    }`}>
                                                        <TrendingDown size={10} /> {isUnderMarket ? "Under" : "Over"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider font-mono uppercase ${
                                                bid.status === "ACCEPTED"
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : bid.status === "REJECTED"
                                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            }`}>
                                                {bid.status}
                                            </span>
                                        </div>

                                        {user.role === "SHIPPER" && bid.status === "PENDING" && (
                                            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
                                                <button
                                                    onClick={() => handleAccept(bid.id)}
                                                    disabled={!!isActing}
                                                    className="p-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-zinc-950 rounded transition"
                                                    title="Accept Bid"
                                                >
                                                    {isActing === "accept" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(bid.id)}
                                                    disabled={!!isActing}
                                                    className="p-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded transition"
                                                    title="Reject Bid"
                                                >
                                                    {isActing === "reject" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
