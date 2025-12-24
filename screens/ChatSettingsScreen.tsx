import React from 'react';

interface ChatSettingsScreenProps {
    onClose: () => void;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="px-4 pb-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h2>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            {children}
        </div>
    </div>
);

const SettingsItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; }> = ({ icon, title, subtitle }) => (
    <button className="w-full flex items-center text-left p-3.5 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-b-0">
        <div className="w-6 h-6 flex items-center justify-center mr-4 text-slate-600">{icon}</div>
        <div className="flex-grow">
            <p className="font-medium text-slate-800 text-base">{title}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </button>
);


const ChatSettingsScreen: React.FC<ChatSettingsScreenProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-14 flex items-center">
                    <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 ml-4">Controls</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                 <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Message controls">
                        <SettingsItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} title="Restricted accounts" subtitle="You won't see when they're online or when they've read your messages." />
                        <SettingsItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} title="Blocked accounts" subtitle="They won't be able to message you or find your profile." />
                    </SettingsSection>
                     <SettingsSection title="Privacy & safety">
                         <SettingsItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Read receipts" subtitle="Allow others to see when you've read their messages." />
                         <SettingsItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} title="Activity status" subtitle="Show when you're active together in a chat." />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default ChatSettingsScreen;