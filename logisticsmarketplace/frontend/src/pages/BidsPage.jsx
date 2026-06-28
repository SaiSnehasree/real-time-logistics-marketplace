import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function BidsPage() {

    const [bids, setBids] = useState([]);

    const fetchBids = () => {
        api.get("/bids")
            .then((res) => setBids(res.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchBids();
    }, []);

    return (
        <Layout>

            <div className="min-h-screen bg-slate-100 p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Bids
                </h1>

                <table className="w-full bg-white rounded-xl shadow overflow-hidden">

                    <thead className="bg-slate-900 text-white">

                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Shipment ID</th>
                    </tr>

                    </thead>

                    <tbody>

                    {bids.map((bid) => (

                        <tr
                            key={bid.id}
                            className="border-b"
                        >
                            <td className="p-4">
                                {bid.id}
                            </td>

                            <td className="p-4">
                                ₹ {bid.amount}
                            </td>

                            <td className="p-4">
    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold
        ${
            bid.status === "ACCEPTED"
                ? "bg-green-100 text-green-700"
                : bid.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
        }`}
    >
        {bid.status}
    </span>
                            </td>

                            <td className="p-4">
                                {bid.shipment?.id}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </Layout>
    );
}