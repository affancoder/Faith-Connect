import React, { useState, useMemo, useCallback } from 'react';
import { ChatUser } from '../types';
import PullToRefresh from '../components/PullToRefresh';
import MessageRequestsScreen from './MessageRequestsScreen';

interface ChatListScreenProps {
    onClose: () => void;
    onOpenChat: (user: ChatUser) => void;
}

interface Conversation {
    id: string;
    user: ChatUser;
    lastMessage: string;
    timestamp: string;
    seen: boolean;
}

const mockConversations: Conversation[] = [
    { 
        id: '1', 
        user: { id: '1', name: 'David R.', avatarUrl: 'https://i.pravatar.cc/100?u=david' },
        lastMessage: 'Of course! What\'s on your mind?',
        timestamp: '1h ago',
        seen: false,
    },
    { 
        id: '2', 
        user: { id: '2', name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/100?u=sarah' },
        lastMessage: 'Sounds good, see you then!',
        timestamp: '3h ago',
        seen: true,
    },
    { 
        id: '3', 
        user: { id: '3', name: 'Michael B.', avatarUrl: 'https://i.pravatar.cc/100?u=michael' },
        lastMessage: 'Thank you so much for the prayer.',
        timestamp: 'yesterday',
        seen: true,
    },
    { 
        id: '4', 
        user: { id: '4', name: 'Emily C.', avatarUrl: 'https://i.pravatar.cc/100?u=emily' },
        lastMessage: 'Let\'s catch up soon.',
        timestamp: '2d ago',
        seen: false,
    },
    { 
        id: '5', 
        user: { id: '5', name: 'Pastor Samuel', avatarUrl: 'https://i.pravatar.cc/100?u=pastor' },
        lastMessage: 'The sermon notes are ready.',
        timestamp: '4d ago',
        seen: true,
    },
];

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onClose, onOpenChat }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState(mockConversations);
    const [isRequestsOpen, setIsRequestsOpen] = useState(false);

    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        setConversations(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    const filteredConversations = useMemo(() => {
        if (!searchTerm.trim()) {
            return conversations;
        }
        return conversations.filter(convo =>
            convo.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, conversations]);

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-10 border-b dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                     <button onClick={onClose} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Messages</h1>
                    <div className="w-10"></div> {/* Spacer to balance the back button */}
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <PullToRefresh onRefresh={handleRefresh}>
                    <div className="container mx-auto max-w-2xl">
                        <div className="p-2 sticky top-0 bg-white dark:bg-slate-900 z-5">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="search"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:text-slate-200 dark:placeholder-slate-400"
                                />
                            </div>
                        </div>
                         <div className="px-4 pt-2 pb-1 flex justify-between items-center">
                            <h2 className="font-bold text-base text-slate-800 dark:text-slate-200">Messages</h2>
                            <button onClick={() => setIsRequestsOpen(true)} className="text-sm font-semibold text-brand-blue">Requests</button>
                        </div>
                        <div>
                            {filteredConversations.map(convo => (
                                <div key={convo.id} onClick={() => onOpenChat(convo.user)} className="flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                    <img src={convo.user.avatarUrl} alt={convo.user.name} className="h-14 w-14 rounded-full" />
                                    <div className="flex-1">
                                        <p className={`text-sm ${!convo.seen ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{convo.user.name}</p>
                                        <div className="flex items-center">
                                             <p className={`text-sm truncate flex-1 ${!convo.seen ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{convo.lastMessage}</p>
                                             <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">&middot; {convo.timestamp}</span>
                                        </div>
                                    </div>
                                    {!convo.seen && (
                                         <div className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0"></div>
                                    )}
                                </div>
                            ))}
                             {filteredConversations.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-slate-500 dark:text-slate-400">No messages found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </PullToRefresh>
            </main>
            {isRequestsOpen && <MessageRequestsScreen onClose={() => setIsRequestsOpen(false)} />}
        </div>
    );
};

export default ChatListScreen;