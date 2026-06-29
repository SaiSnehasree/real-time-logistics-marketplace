import { useEffect, useState } from "react";
import api from "../services/api";

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

    const acceptedBids = bids.filter(
        (bid) => bid.status === "ACCEPTED"
    ).length;

    const rejectedBids = bids.filter(
        (bid) => bid.status === "REJECTED"
    ).length;

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-4xl font-bold text-white">
                    Carrier Bids
                </h1>

                <p className="text-slate-400 mt-2">
                    Review carrier offers submitted for shipments.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400">
                        Total Bids
                    </p>

                    <h3 className="text-3xl font-bold text-cyan-400 mt-2">
                        {bids.length}
                    </h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400">
                        Accepted
                    </p>

                    <h3 className="text-3xl font-bold text-green-400 mt-2">
                        {acceptedBids}
                    </h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400">
                        Rejected
                    </p>

                    <h3 className="text-3xl font-bold text-red-400 mt-2">
                        {rejectedBids}
                    </h3>
                </div>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/20 p-6">

                    <h2 className="text-2xl font-bold text-white">
                        Marketplace Activity
                    </h2>

                    <p className="text-slate-300 mt-2">
                        Active carrier participation across the logistics marketplace.
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-900 text-white">

                        <tr>

                            <th className="p-6 text-center font-semibold">
                                ID
                            </th>

                            <th className="p-6 text-center font-semibold">
                                Amount
                            </th>

                            <th className="p-6 text-center font-semibold">
                                Status
                            </th>

                            <th className="p-6 text-center font-semibold">
                                Shipment ID
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {bids.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="p-10 text-center text-slate-400"
                                >
                                    No bids available.
                                </td>

                            </tr>

                        ) : (

                            bids.map((bid) => (

                                <tr
                                    key={bid.id}
                                    className="
                                    border-t
                                    border-slate-800
                                    text-white
                                    hover:bg-cyan-500/5
                                    transition
                                    "
                                >

                                    <td className="p-6 text-center">
                                        {bid.id}
                                    </td>

                                    <td className="p-6 text-center">
                                        ₹ {Number(bid.amount).toLocaleString()}
                                    </td>

                                    <td className="p-6 text-center">

                                        <span
                                            className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                font-semibold
                                                ${
                                                bid.status === "ACCEPTED"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : bid.status === "REJECTED"
                                                        ? "bg-red-500/20 text-red-400"
                                                        : "bg-yellow-500/20 text-yellow-400"
                                            }
                                            `}
                                        >
                                            {bid.status.charAt(0) +
                                                bid.status
                                                    .slice(1)
                                                    .toLowerCase()}
                                        </span>

                                    </td>

                                    <td className="p-6 text-center">
                                        {bid.shipment?.id}
                                    </td>

                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}