import React, { useState, useMemo } from 'react';

interface FollowingScreenProps {
    onClose: () => void;
}

interface Following {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
}

// Mock data for following
const mockFollowing: Following[] = [
    { id: '1', name: 'Pastor Samuel', username: 'pastorsam', avatarUrl: 'https://i.pravatar.cc/100?u=pastor' },
    { id: '2', name: 'Kenji T.', username: 'kenjit', avatarUrl: 'https://i.pravatar.cc/100?u=kenji' },
    { id: '3', name: 'Maria S.', username: 'marias', avatarUrl: 'https://i.pravatar.cc/100?u=maria' },
    { id: '4', name: 'John D.', username: 'johnd', avatarUrl: 'https://i.pravatar.cc/100?u=john' },
    { id: '5', name: 'Hope Community', username: 'hope', avatarUrl: 'https://i.pravatar.cc/100?u=hope' },
    { id: '6', name: 'Anya P.', username: 'anyap', avatarUrl: 'https://i.pravatar.cc/100?u=anya' },
];


const FollowingScreen: React.FC<FollowingScreenProps> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFollowing = useMemo(() => {
        if (!searchTerm) {
            return mockFollowing;
        }
        return mockFollowing.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-10 border-b dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="w-10"></div> {/* Spacer */}
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Following</h1>
                    <button onClick={onClose} className="text-brand-blue font-medium text-base">Done</button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-2xl">
                    {/* Search Bar */}
                    <div className="p-2 sticky top-14 bg-white dark:bg-slate-900 z-5">
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
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:text-slate-200"
                           />
                        </div>
                    </div>
                    
                    {/* Following List */}
                    <div className="px-4">
                        {filteredFollowing.map(user => (
                            <div key={user.id} className="flex items-center justify-between py-2.5">
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt={user.name} className="h-11 w-11 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm dark:text-slate-200">{user.username}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.name}</p>
                                    </div>
                                </div>
                                <button className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    Following
                                </button>
                            </div>
                        ))}

                        {filteredFollowing.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-slate-500 dark:text-slate-400">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FollowingScreen;