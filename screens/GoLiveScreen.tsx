import React, { useState, useEffect, useRef } from 'react';

interface GoLiveScreenProps {
    onClose: () => void;
}

const GoLiveScreen: React.FC<GoLiveScreenProps> = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const isGoLiveDisabled = !title.trim();

    useEffect(() => {
        let stream: MediaStream | null = null;
        const enableStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera/mic: ", err);
                // Optionally, show an error message to the user
            }
        };

        enableStream();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);
    
    const handleGoLive = () => {
        if (isGoLiveDisabled) return;
        // In a real app, this would initiate the live stream connection
        alert(`Going live with title: "${title}"`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col text-white">
            <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/70"></div>
                
                {/* Header */}
                <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                    <h1 className="text-xl font-bold">Go Live</h1>
                    <button onClick={onClose} className="p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                {/* Footer */}
                <footer className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-4">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a title..."
                        className="w-full bg-white/20 border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button 
                        onClick={handleGoLive}
                        disabled={isGoLiveDisabled}
                        className={`w-full font-bold py-3 px-6 rounded-lg text-base transition-colors ${
                            isGoLiveDisabled 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        Go Live
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default GoLiveScreen;
