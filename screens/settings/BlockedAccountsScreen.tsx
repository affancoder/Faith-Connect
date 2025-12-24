import React, { useState } from 'react';
import { SettingsHeader } from './components';

interface BlockedAccountsScreenProps {
    onBack: () => void;
}

interface BlockedUser {
    id: string;
    name: string;
    avatarUrl: string;
}

const mockBlocked: BlockedUser[] = [
    { id: 'blocked1', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/100?u=johnsmith' },
    { id: 'blocked2', name: 'Test User', avatarUrl: 'https://i.pravatar.cc/100?u=testuser' },
];

const BlockedAccountsScreen: React.FC<BlockedAccountsScreenProps> = ({ onBack }) => {
    const [blockedUsers, setBlockedUsers] = useState(mockBlocked);

    const handleUnblock = (id: string) => {
        setBlockedUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Blocked Accounts" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <div className="px-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Once you block someone, that person can no longer see things you post on your timeline, tag you, invite you to events or groups, start a conversation with you, or add you as a friend.
                        </p>
                    </div>
                    <div className="mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                        {blockedUsers.length > 0 ? blockedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3">
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                                </div>
                                <button onClick={() => handleUnblock(user.id)} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-500">
                                    Unblock
                                </button>
                            </div>
                        )) : (
                            <p className="p-4 text-center text-slate-500 dark:text-slate-400">You haven't blocked anyone.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BlockedAccountsScreen;