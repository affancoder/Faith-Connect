import React, { useState, useEffect, useRef } from 'react';
import { LiveStream } from '../types';

interface ViewLiveStreamScreenProps {
    stream: LiveStream;
    onClose: () => void;
}

const mockComments = [
    { id: 1, user: 'Sarah L.', text: 'Amen! So powerful.' },
    { id: 2, user: 'David R.', text: 'Thank you for this message, pastor! 🙏' },
    { id: 3, user: 'Emily C.', text: 'Praying along with you all.' },
    { id: 4, user: 'Michael B.', text: 'This is exactly what I needed to hear tonight.' },
    { id: 5, user: 'Chris J.', text: 'Praise God! 🙌' },
];

const ViewLiveStreamScreen: React.FC<ViewLiveStreamScreenProps> = ({ stream, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [comments, setComments] = useState(mockComments);
    const commentsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to the bottom of the comments
        if (commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
        }
    }, [comments]);

    const handleVideoTap = () => {
        setIsMuted(prev => !prev);
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).comment as HTMLInputElement;
        const newCommentText = input.value.trim();
        if (newCommentText) {
            const newComment = { id: Date.now(), user: 'You', text: newCommentText };
            setComments(prev => [...prev, newComment]);
            input.value = '';
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col text-white">
            <div className="relative w-full h-full">
                <video 
                    ref={videoRef} 
                    src={stream.videoUrl} 
                    poster={stream.thumbnailUrl}
                    autoPlay 
                    playsInline 
                    loop
                    muted={isMuted}
                    onClick={handleVideoTap}
                    className="w-full h-full object-cover" 
                />
                 {isMuted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/50 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                        </div>
                    </div>
                )}
                
                {/* UI Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/80">
                    {/* Header */}
                    <header className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <img src={stream.streamerAvatar} alt={stream.streamer} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-bold">{stream.streamer}</p>
                                <p className="text-sm text-white/80">{stream.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-600 text-white text-xs font-bold uppercase px-2 py-1 rounded">LIVE</div>
                             <div className="bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                <span>{stream.viewerCount.toLocaleString()}</span>
                            </div>
                            <button onClick={onClose} className="p-1 -mr-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </header>

                    {/* Footer */}
                    <footer className="space-y-3">
                         {/* Comments */}
                        <div ref={commentsContainerRef} className="h-48 max-h-[40vh] overflow-y-auto scrollbar-hide space-y-2 text-sm">
                            {comments.map(comment => (
                                <div key={comment.id} className="bg-black/40 rounded-lg p-2 max-w-xs">
                                    <span className="font-bold mr-2 text-white/80">{comment.user}</span>
                                    <span>{comment.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Input & Actions */}
                        <div className="flex items-center space-x-2">
                             <form onSubmit={handleSendComment} className="flex-1">
                                <input 
                                    name="comment"
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full bg-white/20 border-white/30 rounded-full px-4 py-2.5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            </form>
                            <button className="p-3 bg-white/20 rounded-full text-xl">🙏</button>
                            <button className="p-3 bg-white/20 rounded-full text-xl">❤️</button>
                            <button className="p-3 bg-white/20 rounded-full text-xl">🙌</button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ViewLiveStreamScreen;