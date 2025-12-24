import React, { useState } from 'react';

interface SettingsScreenProps {
    onClose: () => void;
    onNavigate: (screen: string) => void;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="px-4 pb-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h2>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {children}
        </div>
    </div>
);

const SettingsItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; onClick?: () => void; }> = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
        <div className="w-6 h-6 flex items-center justify-center mr-4 text-slate-600 dark:text-slate-400">{icon}</div>
        <div className="flex-grow">
            <p className="font-medium text-slate-800 dark:text-slate-200 text-base">{title}</p>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </button>
);

const ToggleItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; enabled: boolean; onToggle: () => void; }> = ({ icon, title, subtitle, enabled, onToggle }) => (
    <div className="w-full flex items-center text-left p-3.5">
        <div className="w-6 h-6 flex items-center justify-center mr-4 text-slate-600 dark:text-slate-400">{icon}</div>
        <div className="flex-grow" onClick={onToggle}>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-base">{title}</p>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                enabled ? 'bg-brand-blue' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onNavigate }) => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [pauseAllNotifications, setPauseAllNotifications] = useState(false);
    const [theme, setTheme] = useState('System'); // 'Light', 'Dark', 'System'

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center">
                    <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-4">Settings and activity</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    {/* Search Bar */}
                     <div className="px-4 mb-6">
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                               </svg>
                           </span>
                           <input 
                               type="search" 
                               placeholder="Search settings..." 
                               className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:text-slate-200"
                           />
                        </div>
                    </div>

                    <SettingsSection title="Your Account">
                        <SettingsItem onClick={() => onNavigate('accountDetails')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} title="Account Details" subtitle="Personal information"/>
                        <SettingsItem onClick={() => onNavigate('passwordAndSecurity')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} title="Password and Security" subtitle="Password, two-factor authentication"/>
                        <SettingsItem onClick={() => onNavigate('prayerReminders')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} title="Prayer Reminders" subtitle="Set daily reminders to pray"/>
                        <SettingsItem onClick={() => onNavigate('language')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 009 9" /></svg>} title="Language" />
                    </SettingsSection>

                    <SettingsSection title="Privacy">
                        <ToggleItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} title="Private Account" enabled={isPrivate} onToggle={() => setIsPrivate(!isPrivate)} />
                        <SettingsItem onClick={() => onNavigate('mentions')} icon={<svg className="w-6 h-6 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><text x="4" y="19" fontSize="20" fontWeight="bold">@</text></svg>} title="Mentions" subtitle="Control who can @mention you" />
                        <SettingsItem onClick={() => onNavigate('blockedAccounts')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} title="Blocked Accounts"/>
                        <SettingsItem onClick={() => onNavigate('activityStatus')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 7.07a5 5 0 010-7.07M12 6v.01M12 12v.01M12 18v.01" /></svg>} title="Activity Status" subtitle="Show when you're active"/>
                    </SettingsSection>

                    <SettingsSection title="Notifications">
                         <ToggleItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>} title="Pause all" enabled={pauseAllNotifications} onToggle={() => setPauseAllNotifications(!pauseAllNotifications)} />
                        <SettingsItem onClick={() => onNavigate('notificationsPosts')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>} title="Posts, Stories, Comments"/>
                        <SettingsItem onClick={() => onNavigate('notificationsFollow')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} title="Followers and following"/>
                        <SettingsItem onClick={() => onNavigate('notificationsMessages')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} title="Direct Messages"/>
                        <SettingsItem onClick={() => onNavigate('notificationsLiveReels')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Live and Reels"/>
                        <SettingsItem onClick={() => onNavigate('notificationsEvents')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} title="Events"/>
                    </SettingsSection>

                    <SettingsSection title="Content and Display">
                        <SettingsItem onClick={() => onNavigate('theme')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>} title="Theme" subtitle={theme}/>
                        <SettingsItem onClick={() => onNavigate('accessibility')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} title="Accessibility" subtitle="Font size, high contrast"/>
                        <SettingsItem onClick={() => onNavigate('defaultBibleVersion')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} title="Default Bible Version" subtitle="Set your preferred translation" />
                        <SettingsItem onClick={() => onNavigate('mutedAccounts')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg>} title="Muted Accounts" />
                        <SettingsItem onClick={() => onNavigate('dataUsage')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856a8.25 8.25 0 0113.788 0M1.924 8.674a12 12 0 0119.152 0M12 21.75l.394.394a.75.75 0 001.06-1.06L12 19.5l-1.454 1.454a.75.75 0 001.06 1.06l.394-.394z" /></svg>} title="Data Usage" subtitle="Video autoplay"/>
                    </SettingsSection>
                    
                    <SettingsSection title="Support & About">
                        <SettingsItem onClick={() => onNavigate('helpCenter')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Help Center" />
                        <SettingsItem onClick={() => onNavigate('communityGuidelines')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.75M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} title="Community Guidelines"/>
                        <SettingsItem onClick={() => onNavigate('about')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="About" />
                    </SettingsSection>
                    
                    <div className="px-4 mt-6">
                        <h2 className="font-bold text-sm mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Logins</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                            <button className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-brand-blue font-medium">Log out Jane Doe</button>
                             <button className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-brand-blue font-medium">Log out of all accounts</button>
                        </div>
                    </div>

                     <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-6">
                        <p>Faith Connect v1.0.0</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;