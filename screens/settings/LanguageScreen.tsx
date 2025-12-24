import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, RadioItem } from './components';

interface LanguageScreenProps {
    onBack: () => void;
}

const languages = [
    "English (US)",
    "Español",
    "Français",
    "Português (Brasil)",
    "Deutsch",
    "한국어",
    "日本語",
];

const LanguageScreen: React.FC<LanguageScreenProps> = ({ onBack }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("English (US)");

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Language" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Suggested">
                        <RadioItem 
                            label="English (US)"
                            isSelected={selectedLanguage === "English (US)"}
                            onSelect={() => setSelectedLanguage("English (US)")}
                        />
                    </SettingsSection>
                    <SettingsSection title="All Languages">
                        {languages.slice(1).map(lang => (
                            <RadioItem 
                                key={lang}
                                label={lang}
                                isSelected={selectedLanguage === lang}
                                onSelect={() => setSelectedLanguage(lang)}
                            />
                        ))}
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default LanguageScreen;