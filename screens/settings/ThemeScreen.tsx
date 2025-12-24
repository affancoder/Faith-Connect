import React, { useState } from 'react';
import { SettingsSection, RadioItem } from './components';
import { Theme } from '../../App';

interface ThemeScreenProps {
    onBack: () => void;
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const ThemeScreen: React.FC<ThemeScreenProps> = ({ onBack, currentTheme, onThemeChange }) => {
    const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);

    const handleSave = () => {
        onThemeChange(selectedTheme);
        onBack();
    };

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[55] flex flex-col">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="w-16 text-left">
                        <button onClick={onBack} className="text-brand-blue font-medium text-base">
                            Back
                        </button>
                    </div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        Theme
                    </h1>
                    <div className="w-16 text-right">
                        <button
                            onClick={handleSave}
                            disabled={selectedTheme === currentTheme}
                            className={`font-bold text-base ${selectedTheme === currentTheme ? 'text-slate-400 dark:text-slate-600' : 'text-brand-blue'}`}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Appearance">
                        <RadioItem 
                            label="Light"
                            isSelected={selectedTheme === 'light'}
                            onSelect={() => setSelectedTheme('light')}
                        />
                        <RadioItem 
                            label="Dark"
                            isSelected={selectedTheme === 'dark'}
                            onSelect={() => setSelectedTheme('dark')}
                        />
                        <RadioItem 
                            label="System Default"
                            isSelected={selectedTheme === 'system'}
                            onSelect={() => setSelectedTheme('system')}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default ThemeScreen;
