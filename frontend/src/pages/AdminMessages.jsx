import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminMessages() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact");
      setMsgs(res.data || res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMsgs((s) => s.map((m) => (m._id === id ? { ...m, read: true } : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMsgs((s) => s.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
      {loading ? (
        <div>Loading...</div>
      ) : msgs.length === 0 ? (
        <div>No messages</div>
      ) : (
        <div className="space-y-3">
          {msgs.map((m) => (
            <div
              key={m._id}
              className={`p-3 border rounded-md bg-white flex justify-between items-start ${
                m.read ? "opacity-70" : ""
              }`}
            >
              <div>
                <div className="font-medium">
                  {m.name} &lt;{m.email}&gt;
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 whitespace-pre-wrap">{m.message}</div>
                {m.phone && (
                  <div className="text-sm mt-1">Phone: {m.phone}</div>
                )}
              </div>

              <div className="flex flex-col ml-4 space-y-2">
                {!m.read && (
                  <button
                    onClick={() => markRead(m._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Mark read
                  </button>
                )}
                <a
                  href={`mailto:${m.email}?subject=Re:%20Your%20message`}
                  className="px-3 py-1 border rounded text-sm text-blue-600 text-center"
                >
                  Reply
                </a>
                <button
                  onClick={() => remove(m._id)}
                  className="px-3 py-1 border rounded text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
