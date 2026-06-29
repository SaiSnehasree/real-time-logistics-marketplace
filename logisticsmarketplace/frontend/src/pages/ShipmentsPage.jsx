import { useEffect, useState } from "react";
import api from "../services/api";
import {
    MapPin,
    Navigation,
    Weight
} from "lucide-react";
export default function ShipmentsPage() {

    const [shipments, setShipments] = useState([]);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        weight: ""
    });


    const fetchShipments = () => {
        api.get("/shipments")
            .then((res) => setShipments(res.data))
            .catch((err) => console.error(err));
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
        });

        setFormData({
            origin: "",
            destination: "",
            weight: ""
        });

        fetchShipments();
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Delete shipment?")) {
                return;
            }

            const response = await api.delete(`/shipments/${id}`);

            console.log("DELETE SUCCESS", response.data);

            fetchShipments();

        } catch (error) {
            console.error("DELETE FAILED", error);
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-4xl font-bold">
                        Shipments
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Manage and track all shipment records
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl">
                    <p className="text-slate-400 text-sm">
                        Total Shipments
                    </p>

                    <h3 className="text-2xl font-bold text-cyan-400">
                        {shipments.length}
                    </h3>
                </div>

            </div>

            <input
                type="text"
                placeholder="Search by origin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
w-full
bg-slate-900
border
border-slate-800
rounded-2xl
px-5
py-4
mb-6
text-white
placeholder:text-slate-500
focus:border-cyan-500
outline-none
"            />
            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8"
            >
                <h2 className="text-2xl font-bold mb-6">
                    Create Shipment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        placeholder="Origin"
                        value={formData.origin}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                origin: e.target.value
                            })
                        }
                        className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-white"
                    />

                    <input
                        placeholder="Destination"
                        value={formData.destination}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                destination: e.target.value
                            })
                        }
                        className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-white"
                    />

                    <input
                        placeholder="Weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                weight: e.target.value
                            })
                        }
                        className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-white"
                    />

                </div>

                <button
                    className="
mt-6
w-full md:w-auto
px-8
py-3
rounded-xl
bg-gradient-to-r
from-cyan-500
to-blue-600
font-semibold
hover:scale-[1.02]
transition
"      >
                    Create Shipment
                </button>

            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full table-fixed">

                    <thead className="bg-slate-900 text-white">
                    <tr>
                        <th className="p-6 text-center">ID</th>
                        <th className="p-6 text-center">Origin</th>
                        <th className="p-6 text-center">Destination</th>
                        <th className="p-6 text-center">Weight</th>
                        <th className="p-6 text-center">Status</th>
                        <th className="p-6 text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {shipments
                        .filter((shipment) =>
                            shipment.origin
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map((shipment) => (

                            <tr
                                key={shipment.id}
                                className="border-t border-slate-800 text-white hover:bg-slate-800/40 transition"
                            >

                                <td className="p-6 text-center">
                                    {shipment.id}
                                </td>

                                <td className="p-6 text-center">
                                    {shipment.origin}
                                </td>

                                <td className="p-6 text-center">
                                    {shipment.destination}
                                </td>

                                <td className="p-6 text-center">
                                    {shipment.weight}
                                </td>

                                <td className="p-6 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                shipment.status === "AVAILABLE"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : shipment.status === "AWAITING_PICKUP"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : shipment.status === "DELIVERED"
                                                            ? "bg-cyan-500/20 text-cyan-400"
                                                            : "bg-slate-700 text-white"
                                            }`}
                                        >
                                            {shipment.status}
                                        </span>
                                </td>

                                <td className="p-6 text-center">
                                    <button
                                        onClick={() => handleDelete(shipment.id)}
                                        className="
        px-3
        py-2
        bg-red-500
        hover:bg-red-600
        rounded-lg
        text-white
        "
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>

                        ))}
                    </tbody>

                </table>

            </div>

        </div>
        </div>
    );
}