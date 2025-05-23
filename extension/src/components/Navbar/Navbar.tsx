import React from "react";

type View = "send" | "queue";

interface NavbarProps {
  setView: React.Dispatch<React.SetStateAction<View>>;
  deviceId: string | null;
  unreadCount: number;
}

export default function Navbar({setView, deviceId, unreadCount}: NavbarProps) {

    const renderSend = () => {
        setView("send");
    }

    const renderQueue = () => {
        setView("queue");
    }

    return (
        <div>
            <div className="navbar bg-gray-100 text-black">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" onClick={renderSend}>LinkDrop</a>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                    {unreadCount > 0 && (
                        <span
                            className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"
                            style={{ transform: "translate(25%, -25%)" }}
                        ></span>
                    )}
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-gray-100 text-black shadow-md drop-shadow rounded-box z-1 mt-3 w-25 p-2">
                    <li onClick={renderSend}><a>Send</a></li>
                    <li onClick={renderQueue}><a>Queue</a></li>
                </ul>
                </div>
            </div>
            <div className="px-6 font-bold"> Your Device ID: {deviceId}</div>
        </div>
    );
}