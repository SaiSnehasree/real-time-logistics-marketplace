import { Link } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex">

            <aside className="w-64 bg-slate-900 text-white p-6">

                <h2 className="text-2xl font-bold mb-10">
                    Logistics
                </h2>

                <nav className="space-y-4">

                    <Link
                        to="/"
                        className="block hover:text-blue-400"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/shipments"
                        className="block hover:text-blue-400"
                    >
                        Shipments
                    </Link>

                    <Link
                        to="/bids"
                        className="block hover:text-blue-400"
                    >
                        Bids
                    </Link>

                </nav>

            </aside>

            <main className="flex-1">
                {children}
            </main>

        </div>
    );
}