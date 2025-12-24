import React, { useState } from 'react';
import { SettingsHeader } from './components';

interface MutedAccountsScreenProps {
    onBack: () => void;
}

interface MutedUser {
    id: string;
    name: string;
    avatarUrl: string;
}

const mockMuted: MutedUser[] = [
    { id: 'muted1', name: 'Marketing Guru', avatarUrl: 'https://i.pravatar.cc/100?u=marketing' },
];

const MutedAccountsScreen: React.FC<MutedAccountsScreenProps> = ({ onBack }) => {
    const [mutedUsers, setMutedUsers] = useState(mockMuted);

    const handleUnmute = (id: string) => {
        setMutedUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Muted Accounts" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                     <div className="px-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                           Muting an account means their posts and stories won't appear in your feed, but you will still be following them.
                        </p>
                    </div>
                    <div className="mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                        {mutedUsers.length > 0 ? mutedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3">
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                                </div>
                                <button onClick={() => handleUnmute(user.id)} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-500">
                                    Unmute
                                </button>
                            </div>
                        )) : (
                            <p className="p-4 text-center text-slate-500 dark:text-slate-400">You haven't muted anyone.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MutedAccountsScreen;