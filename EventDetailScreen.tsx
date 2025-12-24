import React, { useState } from 'react';
import { Event } from '../types';

interface EventDetailScreenProps {
    event: Event;
    onClose: () => void;
}

const mockAttendees = [
    { id: '1', name: 'David R.', avatarUrl: 'https://i.pravatar.cc/100?u=david' },
    { id: '2', name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/100?u=sarah' },
    { id: '3', name: 'Michael B.', avatarUrl: 'https://i.pravatar.cc/100?u=michael' },
    { id: '4', name: 'Emily C.', avatarUrl: 'https://i.pravatar.cc/100?u=emily' },
];

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ event, onClose }) => {
    const [rsvp, setRsvp] = useState<'going' | 'cant_go' | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const formatDateTime = (date: Date) => {
        return date.toLocaleString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">{event.title}</h1>
                    <button className="p-2 -mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{event.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                         <span className="capitalize font-semibold">{event.type} Event</span>
                         <span>&middot;</span>
                         {event.privacy === 'private' ? 
                            <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg><span>Private</span></>
                            : <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg><span>Public</span></>
                        }
                    </div>
                </div>

                <div className="p-4 space-y-4">
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start space-x-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 dark:text-slate-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDateTime(event.startTime)}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">to {formatDateTime(event.endTime)}</p>
                            </div>
                        </div>
                         <div className="flex items-start space-x-4 mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 dark:text-slate-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Are you going?</h3>
                        <div className="flex space-x-2">
                             <button onClick={() => setRsvp('going')} className={`flex-1 font-semibold py-2 rounded-lg text-sm transition-colors ${rsvp === 'going' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>Going</button>
                             <button onClick={() => setRsvp('cant_go')} className={`flex-1 font-semibold py-2 rounded-lg text-sm transition-colors ${rsvp === 'cant_go' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>Can't Go</button>
                        </div>
                        <div className="flex space-x-2 mt-2">
                           <button onClick={() => setIsSaved(!isSaved)} className="flex-1 flex items-center justify-center space-x-2 font-semibold py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                {isSaved ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-gold" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>}
                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                           </button>
                           <button className="flex-1 flex items-center justify-center space-x-2 font-semibold py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                                <span>Share</span>
                           </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">About this Event</h3>
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{event.description}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Who's Going ({mockAttendees.length})</h3>
                        <div className="space-y-3">
                            {mockAttendees.map(attendee => (
                                <div key={attendee.id} className="flex items-center space-x-3">
                                    <img src={attendee.avatarUrl} alt={attendee.name} className="w-10 h-10 rounded-full" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{attendee.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventDetailScreen;