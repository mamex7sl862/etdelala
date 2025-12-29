import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import api from "../services/api";

const decodeToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Join socket room even if Redux `user` isn't populated yet by decoding token
    const payload = user || decodeToken();
    const userId = payload?.id || payload?.userId || payload?.sub || null;
    if (userId) socket.emit("join", userId);

    // Fetch stored notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        // ignore — still listen for realtime
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();

    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => socket.off("notification");
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-3 rounded-full hover:bg-gray-100 transition"
      >
        🔔
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b">
            <h3 className="font-bold text-lg">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                No new notifications
              </p>
            ) : (
              notifications.map((notif, i) => (
                <div
                  key={i}
                  onClick={async () => {
                    try {
                      // mark as read in DB
                      if (!notif.read)
                        await api.put(`/notifications/${notif._id}/read`);
                      setNotifications((prev) =>
                        prev.map((p) =>
                          p._id === notif._id ? { ...p, read: true } : p
                        )
                      );
                    } catch (err) {
                      console.error("Failed to mark notification read:", err);
                    }
                    if (notif.link) navigate(notif.link);
                    setOpen(false);
                  }}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
