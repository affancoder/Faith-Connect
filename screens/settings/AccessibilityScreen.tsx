import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface AccessibilityScreenProps {
    onBack: () => void;
}

const AccessibilityScreen: React.FC<AccessibilityScreenProps> = ({ onBack }) => {
    const [fontSize, setFontSize] = useState(16);
    const [highContrast, setHighContrast] = useState(false);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Accessibility" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Display">
                        <div className="p-3.5">
                            <label htmlFor="font-size" className="font-medium text-slate-800 dark:text-slate-200 text-base">Font Size</label>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm dark:text-slate-300">Aa</span>
                                <input
                                    id="font-size"
                                    type="range"
                                    min="12"
                                    max="24"
                                    step="1"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-2xl dark:text-slate-300">Aa</span>
                            </div>
                            <p className="text-center text-slate-600 dark:text-slate-400 mt-2" style={{ fontSize: `${fontSize}px` }}>
                                This is how text will appear in the app.
                            </p>
                        </div>
                        <ToggleItem 
                            title="High Contrast Mode"
                            subtitle="Improves text legibility"
                            enabled={highContrast}
                            onToggle={() => setHighContrast(!highContrast)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default AccessibilityScreen;