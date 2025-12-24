import React, { useState } from 'react';
import { SettingsHeader, SettingsSection, ToggleItem } from './components';

interface ActivityStatusScreenProps {
    onBack: () => void;
}

const ActivityStatusScreen: React.FC<ActivityStatusScreenProps> = ({ onBack }) => {
    const [showActivity, setShowActivity] = useState(true);

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black z-[55] flex flex-col">
            <SettingsHeader title="Activity Status" onBack={onBack} />
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="container mx-auto max-w-3xl py-4">
                    <SettingsSection 
                        title="Controls"
                        description="Allow accounts you follow and anyone you message to see when you were last active or are currently active on Faith Connect apps. When this is turned off, you won't be able to see the activity status of other accounts."
                    >
                        <ToggleItem 
                            title="Show Activity Status"
                            enabled={showActivity}
                            onToggle={() => setShowActivity(!showActivity)}
                        />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default ActivityStatusScreen;