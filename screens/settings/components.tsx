import React from 'react';

export const SettingsHeader: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
    <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-14 flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 ml-4">{title}</h1>
        </div>
    </header>
);

export const SettingsSection: React.FC<{ title: string; children: React.ReactNode; description?: string }> = ({ title, children, description }) => (
    <div className="mb-6">
        <h2 className="px-4 pb-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h2>
        <div className="mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {children}
        </div>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-5">{description}</p>}
    </div>
);

export const SettingsItem: React.FC<{ title: string; subtitle?: string; onClick?: () => void; }> = ({ title, subtitle, onClick }) => (
    <button onClick={onClick} disabled={!onClick} className={`w-full flex items-center text-left p-3.5 ${onClick ? 'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors' : 'cursor-default'}`}>
        <div className="flex-grow">
            <p className="font-medium text-slate-800 dark:text-slate-200 text-base">{title}</p>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {onClick && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
    </button>
);

export const ToggleItem: React.FC<{ title: string; subtitle?: string; enabled: boolean; onToggle: () => void; }> = ({ title, subtitle, enabled, onToggle }) => (
    <div className="w-full flex items-center text-left p-3.5">
        <div className="flex-grow" onClick={onToggle}>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-base">{title}</p>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-brand-blue' : 'bg-slate-400 dark:bg-slate-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export const RadioItem: React.FC<{ label: string; isSelected: boolean; onSelect: () => void; }> = ({ label, isSelected, onSelect }) => (
    <button onClick={onSelect} className="w-full flex items-center justify-between text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
        <p className="font-medium text-slate-800 dark:text-slate-200 text-base">{label}</p>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-blue' : 'border-slate-400 dark:border-slate-500'}`}>
            {isSelected && <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>}
        </div>
    </button>
);

export const TextContentScreen: React.FC<{ title: string; onBack: () => void; children: React.ReactNode; }> = ({ title, onBack, children }) => (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[55] flex flex-col">
        <SettingsHeader title={title} onBack={onBack} />
        <main className="flex-grow overflow-y-auto scrollbar-hide">
            <div className="container mx-auto max-w-3xl py-4 px-4 prose dark:prose-invert">
                {children}
            </div>
        </main>
    </div>
);