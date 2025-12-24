import React, { useState, useMemo } from 'react';

interface FriendsScreenProps {
    onClose: () => void;
}

interface Friend {
    id: string;
    name: string;
    avatarUrl: string;
    isOnline: boolean;
}

const mockFriends: Friend[] = [
    { id: '1', name: 'David R.', avatarUrl: 'https://i.pravatar.cc/100?u=david', isOnline: true },
    { id: '2', name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/100?u=sarah', isOnline: false },
    { id: '3', name: 'Michael B.', avatarUrl: 'https://i.pravatar.cc/100?u=michael', isOnline: true },
    { id: '4', name: 'Emily C.', avatarUrl: 'https://i.pravatar.cc/100?u=emily', isOnline: true },
    { id: '5', name: 'Chris J.', avatarUrl: 'https://i.pravatar.cc/100?u=chris', isOnline: false },
    { id: '6', name: 'Pastor Samuel', avatarUrl: 'https://i.pravatar.cc/100?u=pastor', isOnline: true },
];

const mockSuggestions: Friend[] = [
    { id: '7', name: 'Kenji T.', avatarUrl: 'https://i.pravatar.cc/100?u=kenji', isOnline: false },
    { id: '8', name: 'Maria S.', avatarUrl: 'https://i.pravatar.cc/100?u=maria', isOnline: true },
];

const FriendsScreen: React.FC<FriendsScreenProps> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFriends = useMemo(() => {
        return mockFriends.filter(friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const onlineCount = useMemo(() => mockFriends.filter(f => f.isOnline).length, []);

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Friends</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-2xl">
                    <div className="px-4 py-2 sticky top-2 bg-slate-50 dark:bg-slate-900 z-10">
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                               </svg>
                           </span>
                           <input 
                               type="search" 
                               placeholder="Search friends" 
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:text-slate-200"
                           />
                        </div>
                    </div>
                    
                    <div className="px-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">Friends ({onlineCount} online)</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredFriends.map(friend => (
                                <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img src={friend.avatarUrl} alt={friend.name} className="h-12 w-12 rounded-full" />
                                            {friend.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>}
                                        </div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{friend.name}</p>
                                    </div>
                                    <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                         <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Suggestions</h2>
                         <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                            {mockSuggestions.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                                    </div>
                                    <button className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-brand-blue text-white hover:bg-opacity-90">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FriendsScreen;
