import { useState } from 'react';

interface NavbarProps {
  deviceId: string;
}

export default function Send({ deviceId }: NavbarProps) {
    const [isSending, setIsSending] = useState(false);
    const [recipientDeviceId, setRecipientDeviceId] = useState('');
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | "warning" | null>(null);

    function handleSend() {
        const trimmedRecipient = recipientDeviceId.trim();
        const trimmedUrl = url.trim();

        // Device ID: exactly 6 alphanumeric characters
        const deviceIdPattern = /^[a-zA-Z0-9]{6}$/;
        if (!deviceId || !trimmedRecipient || !trimmedUrl) {
            setMessage('All fields are required.');
            setMessageType('error');
            return;
        }
        if (!deviceIdPattern.test(trimmedRecipient)) {
            setMessage('Recipient Device ID must be exactly 6 alphanumeric characters.');
            setMessageType('warning');
            return;
        }

        // URL validation
        try {
            new URL(trimmedUrl);
        } catch {
            setMessage('Please enter a valid URL.');
            setMessageType('warning');
            return;
        }

        setIsSending(true);
        fetch('http://localhost:3000/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, recipientDeviceId: trimmedRecipient, url: trimmedUrl }),
        })
        .then(async res => {
            const data = await res.json();
            setIsSending(false);
            if (!res.ok) {
                setMessage(data.error || 'Failed to send link');
                setMessageType('error');
            } else {
                setMessage(data.message || 'Link sent!');
                setMessageType('success');
                setUrl('');
                setRecipientDeviceId('');
            }
        })
        .catch(() => {
            setIsSending(false);
            setMessage('Network error. Please try again.');
            setMessageType('error');
        });
    }

    if (isSending) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-full mt-[0.5rem]">
                {message && (
                    <div className={`alert mb-[0.5rem] ${messageType === 'success' ? 'alert-success' : messageType === 'error' ? 'alert-error' : 'alert-warning'}`}>
                        <span>{message}</span>
                    </div>
                )}
                <div className="text-base font-medium">Recipient Device ID</div>
                <input type="text" value={recipientDeviceId} className="bg-gray-200 w-[75%] h-[2rem] rounded-md px-3" placeholder="Device ID" onChange={e => setRecipientDeviceId(e.target.value)}></input>
                <div className="text-base font-medium">URL</div>
                <input type="text" value={url} className="bg-gray-200 w-[75%] h-[2rem] rounded-md px-3" placeholder="https://example.com" onChange={e => setUrl(e.target.value)}></input>
                <button onClick={handleSend} className="bg-gray-300 mt-[1.5rem] w-[75%] h-[2rem] rounded-md">Send</button>
            </div>
        </div>
    );
}

