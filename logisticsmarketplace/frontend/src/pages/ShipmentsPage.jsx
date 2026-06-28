import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout.jsx";

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
            .then(res => setShipments(res.data));
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

    return (
        <Layout>
            <div className="min-h-screen bg-slate-100 p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Shipments
                </h1>
                <input
                    type="text"
                    placeholder="Search by origin..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-3 rounded mb-4 w-full"
                />

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow mb-8"
                >



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
                            className="border p-3 rounded"
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
                            className="border p-3 rounded"
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
                            className="border p-3 rounded"
                        />

                    </div>


                    <button
                        className="mt-4 bg-slate-900 text-white px-6 py-3 rounded"
                    >
                        Create Shipment
                    </button>

                </form>

                <table className="w-full bg-white rounded-xl shadow overflow-hidden">
                    <thead>
                    <tr className="border-b">
                        <th className="p-4">ID</th>
                        <th className="p-4">Origin</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">Weight</th>
                        <th className="p-4">Status</th>
                    </tr>
                    </thead>

                    <tbody>

                    {shipments
                        .filter(shipment =>
                            shipment.origin
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map(shipment => (
                        <tr key={shipment.id} className="border-b">

                            <td className="p-4">
                                {shipment.id}
                            </td>

                            <td className="p-4">
                                {shipment.origin}
                            </td>

                            <td className="p-4">
                                {shipment.destination}
                            </td>

                            <td className="p-4">
                                {shipment.weight}
                            </td>

                            <td className="p-4">
    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold
        ${
            shipment.status === "AVAILABLE"
                ? "bg-blue-100 text-blue-700"
                : shipment.status === "AWAITING_PICKUP"
                    ? "bg-yellow-100 text-yellow-700"
                    : shipment.status === "IN_TRANSIT"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
        }`}
    >
        {shipment.status}
    </span>
                            </td>

                        </tr>
                    ))}

                    </tbody>

                </table>

            </div>
        </Layout>
    );
}
