import React from 'react';
import { LiveStream } from '../types';

interface LiveStreamsScreenProps {
    onClose: () => void;
    onGoLive: () => void;
    onViewStream: (stream: LiveStream) => void;
}

const mainLiveStream: LiveStream = {
    id: 'live1',
    title: 'Evening Worship & Prayer Session',
    streamer: 'Hope Community Church',
    streamerAvatar: 'https://i.pravatar.cc/100?u=hope',
    viewerCount: 2300,
    thumbnailUrl: 'https://images.unsplash.com/photo-1587221391924-5872a13813f8?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
};

const otherLiveStreams: LiveStream[] = [
    { id: 'live2', title: 'Q&A with Pastor Samuel', streamer: 'Pastor Samuel', streamerAvatar: 'https://i.pravatar.cc/100?u=pastor', viewerCount: 850, thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { id: 'live3', title: 'Youth Group Hangout', streamer: 'David R.', streamerAvatar: 'https://i.pravatar.cc/100?u=david', viewerCount: 150, thumbnailUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
    { id: 'live4', title: 'Mission Trip Update from Kenya', streamer: 'Sarah L.', streamerAvatar: 'https://i.pravatar.cc/100?u=sarah', viewerCount: 450, thumbnailUrl: 'https://images.unsplash.com/photo-1527814223023-e31c1554687c?q=80&w=400&auto=format&fit=crop', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
];

const LiveStreamsScreen: React.FC<LiveStreamsScreenProps> = ({ onClose, onGoLive, onViewStream }) => {
    
    const LiveStreamCard: React.FC<{ stream: LiveStream, isFeatured?: boolean }> = ({ stream, isFeatured = false }) => (
        <button onClick={() => onViewStream(stream)} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer group text-left w-full">
            <div className="relative">
                <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-auto bg-slate-200 dark:bg-slate-700" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold uppercase px-2 py-1 rounded">LIVE</div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">{stream.viewerCount.toLocaleString()} viewers</div>
            </div>
            <div className="p-3">
                <p className={`font-bold text-slate-800 dark:text-slate-200 ${isFeatured ? 'text-lg' : 'text-base'}`}>{stream.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stream.streamer}</p>
            </div>
        </button>
    );
    
    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-black z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 border-b dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                     <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Live Streams</h1>
                    <button onClick={onGoLive} className="p-2 -mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-2xl p-4 space-y-6">
                    <div>
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">Featured Live</h2>
                        <LiveStreamCard stream={mainLiveStream} isFeatured={true} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">Ongoing Streams</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {otherLiveStreams.map(stream => (
                                <LiveStreamCard key={stream.id} stream={stream} />
                            ))}
                        </div>
                    </div>
                     <div className="text-center py-4">
                        <button className="font-semibold text-brand-blue hover:underline">
                            See past live streams
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LiveStreamsScreen;