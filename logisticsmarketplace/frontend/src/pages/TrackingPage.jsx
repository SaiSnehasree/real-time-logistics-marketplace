import { useEffect, useState } from "react";
import {

    Truck,
    Clock,
    CheckCircle
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

    const cityCoordinates = {
        Hyderabad: [17.3850, 78.4867],
        Chennai: [13.0827, 80.2707],
        Bangalore: [12.9716, 77.5946],
        Mumbai: [19.0760, 72.8777],
        Delhi: [28.6139, 77.2090],
        Pune: [18.5204, 73.8567],
        Kerala: [10.8505, 76.2711]
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const response = await api.get("/shipments");
            console.log(response.data);
            setShipments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getProgress = (status) => {
        switch (status) {
            case "AVAILABLE":
                return 20;
            case "AWAITING_PICKUP":
                return 50;
            case "IN_TRANSIT":
                return 80;
            case "DELIVERED":
                return 100;
            default:
                return 10;
        }
    };

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-3xl font-bold">
                    Shipment Tracking
                </h1>

                <p className="text-slate-400 mt-2">
                    Monitor shipment progress across your logistics network.
                </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h2 className="text-xl font-semibold">
                    Live Tracking Overview
                </h2>

                <p className="text-slate-400 mt-2">
                    {shipments.length} shipments currently being tracked
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {shipments.length === 0 ? (

                    <div className="text-center text-slate-400 py-10">
                        No shipments currently being tracked.
                    </div>

                ) : (

                    shipments.map((shipment) => (
                    <div
                        key={shipment.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
                    >

                        <div className="flex justify-between mb-4">

                            <h3 className="font-semibold">
                                SHIP-{shipment.id}
                            </h3>

                            <span
                                className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${
                                    shipment.status === "AVAILABLE"
                                        ? "bg-green-500/20 text-green-400"
                                        : shipment.status === "AWAITING_PICKUP"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : shipment.status === "DELIVERED"
                                                ? "bg-cyan-500/20 text-cyan-400"
                                                : "bg-slate-700 text-white"
                                }
    `}
                            >
    {shipment.status.replace("_", " ")}
</span>

                        </div>

                        <p className="mb-3">
                            {shipment.origin} → {shipment.destination}
                        </p>

                        <div className="mb-2 flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{getProgress(shipment.status)}%</span>
                        </div>

                        <div className="h-3 bg-slate-800 rounded-full">

                            <div
                                className={`h-full rounded-full ${
                                    shipment.status === "DELIVERED"
                                        ? "bg-green-500"
                                        : shipment.status === "AWAITING_PICKUP"
                                            ? "bg-yellow-500"
                                            : "bg-cyan-500"
                                }`}                                style={{
                                    width: `${getProgress(shipment.status)}%`
                                }}
                            />

                        </div>

                    </div>

                    )))}

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Live Shipment Map
                </h2>

                <div className="rounded-2xl overflow-hidden">

                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        style={{
                            height: "450px",
                            width: "100%"
                        }}
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {shipments.map((shipment) => {

                            const coords =
                                cityCoordinates[
                                    shipment.origin
                                    ];

                            if (!coords) return null;

                            return (
                                <Marker
                                    key={shipment.id}
                                    position={coords}
                                >
                                    <Popup>
                                        Shipment #{shipment.id}
                                        <br />
                                        {shipment.origin}
                                        <br />
                                        {shipment.destination}
                                    </Popup>
                                </Marker>
                            );
                        })}

                    </MapContainer>

                </div>

            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

                <h2 className="text-xl font-semibold mb-6">
                    Recent Shipment Activity
                </h2>

                <div className="space-y-4">

                    {shipments.map((shipment) => (

                        <div
                            key={shipment.id}
                            className="flex items-center gap-4 border-b border-slate-800 pb-4"
                        >

                            {shipment.status === "DELIVERED" ? (
                                <CheckCircle className="text-green-400" />
                            ) : shipment.status === "AWAITING_PICKUP" ? (
                                <Clock className="text-yellow-400" />
                            ) : (
                                <Truck className="text-cyan-400" />
                            )}

                            <div>

                                <p>
                                    Shipment #{shipment.id}
                                </p>

                                <p className="text-sm text-slate-400">
                                    {shipment.origin} → {shipment.destination}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}
