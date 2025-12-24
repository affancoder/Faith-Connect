import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, RadioItem } from './components';

interface DefaultBibleVersionScreenProps {
    onBack: () => void;
}

const bibleVersions = [
    "New International Version (NIV)",
    "King James Version (KJV)",
    "English Standard Version (ESV)",
    "New Living Translation (NLT)",
    "Christian Standard Bible (CSB)",
    "The Message (MSG)",
];

const DefaultBibleVersionScreen: React.FC<DefaultBibleVersionScreenProps> = ({ onBack }) => {
    const [selectedVersion, setSelectedVersion] = useState("New International Version (NIV)");

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Default Bible Version" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection title="Select a Translation">
                        {bibleVersions.map(version => (
                            <RadioItem 
                                key={version}
                                label={version}
                                isSelected={selectedVersion === version}
                                onSelect={() => setSelectedVersion(version)}
                            />
                        ))}
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default DefaultBibleVersionScreen;