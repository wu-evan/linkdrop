import { useEffect, useState } from "react";

interface NavbarProps {
  deviceId: string;
}

export default function Queue({ deviceId }: NavbarProps) {
    const [queue, setQueue] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | "warning" | null>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/links?deviceId=${encodeURIComponent(deviceId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Failed to fetch queue');
                setMessageType('error');
                setTimeout(() => {
                    setMessage(null);
                    setMessageType(null);
                }, 2000);
            } else {
                setQueue(data);
                console.log("Queue data:", data);
            }
        })
        .catch(() => {
            setMessage('Network error. Please try again.');
            setMessageType('error');
            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 2000);
        });
    }, [deviceId]);


    function handleDelete(deviceId: string, linkId: string){
        fetch(`http://localhost:3000/api/links?deviceId=${encodeURIComponent(deviceId)}&linkId=${encodeURIComponent(linkId)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
         .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Failed to delete link');
                setMessageType('error');
                  setTimeout(() => {
                    setMessage(null);
                    setMessageType(null);
                }, 2000);
            } else {
                setQueue(data);
            }
        })
        .catch(() => {
            setMessage('Network error. Please try again.');
            setMessageType('error');
            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 2000);
        });
    }

    return (
        <div className="px-5">
            <h2 className="text-2xl font-bold mb-4 text-center mt-[1rem]">Queue</h2>
            {message && (
                    <div className={`alert mb-[0.5rem] ${messageType === 'success' ? 'alert-success' : messageType === 'error' ? 'alert-error' : 'alert-warning'}`}>
                        <span>{message}</span>
                    </div>
            )}
            <div
                className="flex flex-col bg-gray-100 gap-4 overflow-y-auto rounded-md pb-[5rem]"
                style={{ maxHeight: "340px"}}
            >
                {queue.map((item, idx) => (
                    <div key={idx} className="card bg-gray-200 shadow-md">
                        <div className="card-body">
                            <div className="flex flex-row justify-between">
                                <h3 className="card-title">From: {item.senderId}</h3>
                                <button onClick={() => handleDelete(deviceId, item.linkId)} className="btn btn-sm bg-gray-200 focus:outline-none hover:bg-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current text-black" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                            <p>
                                <strong>URL:</strong>{" "}
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="link link-primary break-all">
                                    {item.url}
                                </a>
                            </p>
                            <p>
                                <strong>Sent At:</strong> {new Date(item.sentAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}