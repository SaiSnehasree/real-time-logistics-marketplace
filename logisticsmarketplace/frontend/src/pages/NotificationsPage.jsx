import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Bell, Check, Loader2 } from "lucide-react";
import { connectWebSocket, subscribeToNotifications } from "../services/websocket";

const TYPE_LABELS = {
    NEW_BID: "New Bid",
    BID_ACCEPTED: "Bid Accepted",
    BID_REJECTED: "Bid Rejected",
    SHIPMENT_UPDATE: "Shipment Update",
    LOCATION_UPDATE: "Location Update",
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const subscriptionRef = useRef(null);

    const fetchNotifications = () => {
        setLoading(true);
        api.get("/notifications")
            .then((res) => setNotifications(res.data.data || []))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchNotifications();

        // Connect and subscribe — store subscription in ref so cleanup works
        connectWebSocket(() => {
            if (user.id) {
                subscriptionRef.current = subscribeToNotifications(user.id, (newNotif) => {
                    setNotifications((prev) => [newNotif, ...prev]);
                });
            }
        });

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Bell className="text-cyan-500" /> Notification Center
                        {unreadCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 text-[10px] font-bold font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                                {unreadCount} unread
                            </span>
                        )}
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Updates on your shipments, bids, and network activity.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-3 py-1.5 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs transition flex items-center gap-1.5"
                    >
                        <Check size={14} /> Mark all read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-zinc-900/60 border border-zinc-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-xl border flex items-center justify-between transition ${
                                notif.read
                                    ? 'bg-zinc-900/40 border-zinc-800'
                                    : 'bg-zinc-900 border-cyan-500/30'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-zinc-700' : 'bg-cyan-500 animate-pulse'}`} />
                                <div>
                                    <p className={`text-sm ${notif.read ? 'text-zinc-400' : 'text-zinc-200'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-[10px] text-zinc-600 mt-1 font-mono uppercase tracking-wider">
                                        {new Date(notif.createdAt).toLocaleString()} &nbsp;•&nbsp;
                                        {TYPE_LABELS[notif.type] || notif.type?.replace(/_/g, ' ')}
                                        {notif.referenceId && (
                                            <span className="ml-1 text-zinc-700">• SHIP-{notif.referenceId}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="text-zinc-500 hover:text-cyan-400 p-2 transition flex-shrink-0"
                                    title="Mark as read"
                                >
                                    <Check size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                            <Bell className="mx-auto text-zinc-700 mb-3" size={28} />
                            <p>You have no notifications yet.</p>
                            <p className="text-xs text-zinc-700 mt-1">Notifications appear here when bids are placed or shipments update.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
