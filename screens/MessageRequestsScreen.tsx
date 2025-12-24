import React, { useState } from 'react';

interface MessageRequestsScreenProps {
    onClose: () => void;
}

interface MessageRequest {
    id: string;
    user: {
        name: string;
        avatarUrl: string;
    };
    messageSnippet: string;
}

const mockRequests: MessageRequest[] = [
    {
        id: 'req1',
        user: { name: 'John Peterson', avatarUrl: 'https://i.pravatar.cc/100?u=johnp' },
        messageSnippet: 'Hi Jane, I saw your post on the global wall and it really resonated with me. I\'d love to connect.'
    },
    {
        id: 'req2',
        user: { name: 'Grace Community Church', avatarUrl: 'https://i.pravatar.cc/100?u=gracechurch' },
        messageSnippet: 'We have an upcoming event we think you might be interested in. Can I send you the details?'
    },
    {
        id: 'req3',
        user: { name: 'MariaS', avatarUrl: 'https://i.pravatar.cc/100?u=marias' },
        messageSnippet: 'Hello! Are you the Jane Doe that went to the Hope Conference last year?'
    }
];

const MessageRequestsScreen: React.FC<MessageRequestsScreenProps> = ({ onClose }) => {
    const [requests, setRequests] = useState<MessageRequest[]>(mockRequests);

    const handleDecline = (id: string) => {
        setRequests(prev => prev.filter(req => req.id !== id));
    };
    
    const handleAccept = (id: string) => {
        // In a real app, this would move the conversation to the main chat list
        handleDecline(id); // For now, just remove it from requests
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-10 border-b dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center">
                    <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 ml-4">Message requests</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-2xl">
                    <p className="text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
                        These are from people you don't follow. They won't know you've seen their request until you accept it.
                    </p>
                    {requests.length > 0 ? (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {requests.map(req => (
                                <div key={req.id} className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <img src={req.user.avatarUrl} alt={req.user.name} className="h-12 w-12 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{req.user.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{req.messageSnippet}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 mt-3">
                                        <button onClick={() => handleDecline(req.id)} className="px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg">
                                            Decline
                                        </button>
                                        <button onClick={() => handleAccept(req.id)} className="px-4 py-1.5 text-sm font-semibold text-white bg-brand-blue hover:bg-opacity-90 rounded-lg">
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">No message requests</h2>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">You don't have any message requests right now.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MessageRequestsScreen;