import { useEffect, useState } from "react";

interface NavbarProps {
  deviceId: string;
}

export default function Queue({ deviceId }: NavbarProps) {
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/links?deviceId=${encodeURIComponent(deviceId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to fetch queue');
            } else {
                setQueue(data);
                console.log("Queue data:", data);
            }
        })
        .catch(() => {
            alert('Network error. Please try again.');
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
                alert(data.error || 'Failed to delete link');
            } else {
                setQueue(data);
            }
        })
        .catch(() => {
            alert('Network error. Please try again.');
        });
    }

    return (
        <div className="px-5">
            <h2 className="text-2xl font-bold mb-4 text-center mt-[1rem]">Queue</h2>
            <div
                className="flex flex-col bg-gray-100 gap-4 overflow-y-auto rounded-md"
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