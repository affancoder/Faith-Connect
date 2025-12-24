import React from 'react';

type Tab = 'home' | 'discover' | 'reels' | 'global' | 'events';

interface BottomNavBarProps {
    activeTab: string;
    setActiveTab: (tab: Tab | 'profile') => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, activeIcon, isActive, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full focus:outline-none">
        {isActive ? activeIcon : icon}
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        {
            key: 'home',
            onClick: () => setActiveTab('home'),
            isActive: activeTab === 'home',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
        },
        {
            key: 'discover',
            onClick: () => setActiveTab('discover'),
            isActive: activeTab === 'discover',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>,
        },
        {
            key: 'global',
            onClick: () => setActiveTab('global'),
            isActive: activeTab === 'global',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.586-.586a2 2 0 012.828 0l2 2a2 2 0 010 2.828l-5 5A2 2 0 017 13.586V12a2 2 0 012-2h2.586l.293-.293a1 1 0 000-1.414l-2.586-2.586a2 2 0 00-2.828 0l-.586.586z" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
        },
        {
            key: 'reels',
            onClick: () => setActiveTab('reels'),
            isActive: activeTab === 'reels',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.134v3.732a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664l-3.197-2.132z" clipRule="evenodd" /></svg>
        },
        {
            key: 'events',
            onClick: () => setActiveTab('events'),
            isActive: activeTab === 'events',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
        },
    ];

    return (
        <footer className="sticky bottom-0 bg-white dark:bg-slate-900 shadow-t border-t border-slate-200 dark:border-slate-800 z-10">
            <div className="container mx-auto h-16 flex items-center justify-around">
                {navItems.map((item) => (
                   <NavItem 
                        key={item.key}
                        icon={item.icon}
                        activeIcon={item.activeIcon}
                        isActive={item.isActive}
                        onClick={item.onClick}
                    />
                ))}
            </div>
        </footer>
    );
};

export default BottomNavBar;