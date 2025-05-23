import Navbar from "../components/Navbar/Navbar";
import Send from "../views/Send";
import Queue from "../views/Queue";
import { useState, useEffect } from "react";
import { customAlphabet } from "nanoid";

export default function App() {
  const [view, setView] = useState<"send" | "queue">("send");
  const [deviceId, setDeviceId] = useState<string>("null");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);

  useEffect(() => {
    const DEVICE_ID_KEY = "device_id";

    const registerDevice = async () => {
      let deviceId = localStorage.getItem(DEVICE_ID_KEY);

      if (!deviceId) {
        deviceId = nanoid();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);

        try {
          await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId: deviceId }),
          });
          console.log("Device registered:", deviceId);
        } catch (err) {
          console.error("Failed to register device", err);
        }
      }

      setDeviceId(deviceId);
    };

    registerDevice();
  }, []);

  useEffect(() => {
    if (!deviceId || deviceId === "null") return;

    if (view === "queue") {
      fetch("http://localhost:3000/api/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      })
        .then(() => setUnreadCount(0))
        .catch(() => setUnreadCount(0));
    } else {
      fetch(`http://localhost:3000/api/links?deviceId=${encodeURIComponent(deviceId)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const count = data.filter(link => link.unread !== false).length;
            setUnreadCount(count);
          }
        })
        .catch(() => setUnreadCount(0));
    }
  }, [deviceId, view]);

  return ( 
    <div className="h-[425px] w-[300px] bg-gray-100 text-black overflow-hidden rounded-md shadow-lg">
      <Navbar setView={setView} deviceId={deviceId} unreadCount={unreadCount}/>
        {view === 'send' && <Send deviceId={deviceId}/> }
        {view === 'queue' && <Queue deviceId={deviceId}/>}
    </div>
  );
}
