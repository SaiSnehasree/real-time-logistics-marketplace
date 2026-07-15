import { useEffect, useState } from "react";
import {
    Truck,
    Clock,
    CheckCircle,
    Navigation,
    Compass,
    User,
    AlertTriangle,
    ShieldAlert,
    Locate,
    Play
} from "lucide-react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import api from "../services/api";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TrackingPage() {

    const [shipments, setShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);

    const cityCoordinates = {
        Hyderabad: [17.3850, 78.4867],
        Chennai: [13.0827, 80.2707],
        Bangalore: [12.9716, 77.5946],
        Mumbai: [19.0760, 72.8777],
        Delhi: [28.6139, 77.2090],
        Pune: [18.5204, 73.8567],
        Kerala: [10.8505, 76.2711]
    };

    const fetchShipments = async () => {
        try {
            const response = await api.get("/shipments");
            setShipments(response.data);
            if (response.data.length > 0) {
                setSelectedShipment(response.data[0]);
            }
        } catch (error) {
            console.error(error);
            setShipments([]);
            setSelectedShipment(null);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    const getProgress = (status) => {
        switch (status) {
            case "AVAILABLE": return 20;
            case "AWAITING_PICKUP": return 50;
            case "IN_TRANSIT": return 80;
            case "DELIVERED": return 100;
            default: return 10;
        }
    };

    return (
        <div className="space-y-6">

            {/* Title & Stats HUD */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Compass size={22} className="text-cyan-400" /> Control Tower GPS Tracking
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Monitor dispatch coordinates, telemetry data, and route safety compliance maps.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-500">Active Fleet tracking:</span>
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-bold">
                        {shipments.length} Vehicles
                    </span>
                </div>
            </div>

            {/* Split Screen Control Panel */}
            <div className="grid lg:grid-cols-3 gap-6 h-[600px]">

                {/* Left Telemetry Sidebar */}
                <div className="lg:col-span-1 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between overflow-y-auto space-y-4">
                    
                    {/* Shipment selector */}
                    <div>
                        <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-2">Selected Dispatch Lane</label>
                        <select 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-zinc-700 outline-none"
                            value={selectedShipment ? selectedShipment.id : ""}
                            onChange={(e) => {
                                const found = shipments.find(s => s.id === Number(e.target.value));
                                if (found) setSelectedShipment(found);
                            }}
                        >
                            {shipments.map(s => (
                                <option key={s.id} value={s.id}>
                                    SHIP-{s.id} ({s.origin} → {s.destination})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedShipment && (
                        <div className="space-y-4 flex-1">
                            
                            {/* Alert banner if deviation occurs */}
                            {selectedShipment.deviation && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2 text-xs">
                                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Route Deviation Alert:</strong> Vehicle departed from pre-planned route near Expressway intersection.
                                    </div>
                                </div>
                            )}

                            {/* Dispatch stats telemetry */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-850">
                                    <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">ETA Confidence</p>
                                    <p className="font-bold text-white font-mono mt-0.5">{selectedShipment.etaConfidence ? `${selectedShipment.etaConfidence}%` : "N/A"}</p>
                                </div>
                                <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-850">
                                    <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">Live Velocity</p>
                                    <p className="font-bold text-white font-mono mt-0.5">{selectedShipment.speed ? `${selectedShipment.speed} km/h` : "N/A"}</p>
                                </div>
                                <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-850">
                                    <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">Last GPS Ping</p>
                                    <p className="font-bold text-cyan-400 font-mono mt-0.5">{selectedShipment.ping || "N/A"}</p>
                                </div>
                                <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-850">
                                    <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">Active Driver</p>
                                    <p className="font-bold text-zinc-200 mt-0.5 truncate">{selectedShipment.driverName || "Unassigned"}</p>
                                </div>
                            </div>

                            {/* Milestone timeline */}
                            <div>
                                <h4 className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-2.5">Timeline Checklist</h4>
                                <div className="space-y-3.5 pl-3 border-l border-zinc-800 ml-1.5 relative">
                                    <div className="relative text-xs">
                                        <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                                        <p className="font-semibold text-zinc-200">Load Dispatched</p>
                                        <p className="text-[10px] text-zinc-500">Gate out completed at dispatcher terminal</p>
                                    </div>
                                    <div className="relative text-xs">
                                        <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
                                            selectedShipment.status === "DELIVERED" ? "bg-emerald-500" : "bg-cyan-500 animate-pulse"
                                        }`} />
                                        <p className="font-semibold text-zinc-200">In Transit Checkpoint</p>
                                        <p className="text-[10px] text-zinc-500">Telemetry reporting normal velocity ranges</p>
                                    </div>
                                    <div className="relative text-xs">
                                        <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
                                            selectedShipment.status === "DELIVERED" ? "bg-emerald-500" : "bg-zinc-800"
                                        }`} />
                                        <p className="font-semibold text-zinc-400">Cargo Handover</p>
                                        <p className="text-[10px] text-zinc-600">Pending receiver signature verification</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Right Interactive Map Section */}
                <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden relative dark-map">
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {shipments.map((shipment) => {
                            const coords = cityCoordinates[shipment.origin];
                            if (!coords) return null;

                            return (
                                <Marker
                                    key={shipment.id}
                                    position={coords}
                                >
                                    <Popup>
                                        <div className="p-1 font-sans text-xs">
                                            <p className="font-bold text-zinc-900">SHIP-{shipment.id}</p>
                                            <p className="text-zinc-600 font-mono mt-0.5">{shipment.origin} → {shipment.destination}</p>
                                            <p className="text-zinc-500 mt-1">Status: {shipment.status}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

            </div>

        </div>
    );
}


