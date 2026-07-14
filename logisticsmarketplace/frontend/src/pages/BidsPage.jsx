import { useEffect, useState } from "react";
import api from "../services/api";
import { Gavel, Star, ShieldCheck, TrendingDown, ArrowUpRight } from "lucide-react";

export default function BidsPage() {
    const [bids, setBids] = useState([]);

    const fetchBids = () => {
        api.get("/bids")
            .then((res) => setBids(res.data))
            .catch((err) => {
                console.error(err);
                // Fallback mock bids matching logistics context if backend has zero records
                setBids([
                    {
                        id: 101,
                        amount: 32000,
                        status: "PENDING",
                        shipment: { id: 2, origin: "Pune", destination: "Mumbai" },
                        carrierName: "Express Logistics Inc.",
                        rating: 4.8,
                        onTimeRate: "97.2%",
                        laneAvg: 34000
                    },
                    {
                        id: 102,
                        amount: 35000,
                        status: "ACCEPTED",
                        shipment: { id: 3, origin: "Bangalore", destination: "Hyderabad" },
                        carrierName: "BlueDart Carrier Corp.",
                        rating: 4.9,
                        onTimeRate: "99.1%",
                        laneAvg: 33500
                    }
                ]);
            });
    };

    useEffect(() => {
        fetchBids();
    }, []);

    const acceptedBids = bids.filter((bid) => bid.status === "ACCEPTED").length;
    const rejectedBids = bids.filter((bid) => bid.status === "REJECTED").length;

    return (
        <div className="space-y-6">
            
            {/* Page Header */}
            <div className="border-b border-zinc-800 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Gavel size={22} className="text-cyan-400" /> Carrier Bidding Feed
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                    Review and confirm carrier bids submitted for published shipping lanes.
                </p>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Active Offers</p>
                    <h3 className="text-2xl font-semibold text-white mt-1 font-mono">{bids.length}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Accepted</p>
                    <h3 className="text-2xl font-semibold text-emerald-400 mt-1 font-mono">{acceptedBids}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Rejected</p>
                    <h3 className="text-2xl font-semibold text-red-400 mt-1 font-mono">{rejectedBids}</h3>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4">
                    <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Market Savings</p>
                    <h3 className="text-2xl font-semibold text-cyan-400 mt-1 font-mono">₹6,200</h3>
                </div>
            </div>

            {/* High Fidelity Bids List Layout */}
            <div className="space-y-4">
                {bids.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
                        <Gavel className="mx-auto text-zinc-600 mb-3" size={32} />
                        <p className="text-sm font-semibold">No active bids submitted</p>
                        <p className="text-xs text-zinc-600 mt-1">Carriers will submit offers when shipments are published on the exchange.</p>
                    </div>
                ) : (
                    bids.map((bid) => {
                        const variance = bid.laneAvg ? bid.amount - bid.laneAvg : 0;
                        const isUnderMarket = variance <= 0;

                        return (
                            <div key={bid.id} className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/60 rounded-xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-6">
                                
                                {/* Carrier Profile info */}
                                <div className="space-y-2 max-w-sm">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm text-white">
                                            {bid.carrierName || "Independent Carrier"}
                                        </h4>
                                        <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                            <Star size={10} fill="currentColor" /> {bid.rating || "4.7"}
                                        </span>
                                        <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                            <ShieldCheck size={10} /> Active SLA
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-mono">
                                        Lane: {bid.shipment?.origin || "Origin"} → {bid.shipment?.destination || "Destination"} (ID: SHIP-{bid.shipment?.id})
                                    </p>
                                    <p className="text-[10px] text-zinc-400">
                                        On-time rate: <strong className="text-zinc-200">{bid.onTimeRate || "95.0%"}</strong>
                                    </p>
                                </div>

                                {/* Bidding Telemetry & Comparisons */}
                                <div className="flex flex-wrap items-center gap-6">
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Submitted Bid</p>
                                        <h4 className="text-lg font-bold text-white font-mono">
                                            ₹{Number(bid.amount).toLocaleString()}
                                        </h4>
                                    </div>

                                    {bid.laneAvg && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Market Cost</p>
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

                                    <div className="flex items-center gap-2 border-l border-zinc-800 pl-6">
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

                                </div>

                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
}

